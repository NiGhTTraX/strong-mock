import { Mock } from './mock/mock';

export type Property = string | symbol;

export interface ProxyTraps {
  /**
   * Called when accessing any property on an object, except for
   * `.call`, `.apply` and `.bind`.
   */
  property: (property: Property) => unknown;

  /**
   * Called when calling a function.
   *
   * @example
   * ```
   * fn(...args)
   * ```
   *
   * @example
   * ```
   * fn.call(this, ...args)
   * ```
   *
   * @example
   * ```
   * fn.apply(this, [...args])
   * ```
   *
   * @example
   * ```
   * Reflect.apply(fn, this, [...args])
   * ```
   */
  apply: (args: any[]) => unknown;

  /**
   * Called when getting the proxy's own enumerable keys.
   *
   * @example
   * ```
   * Object.keys(proxy);
   * ```
   *
   * @example
   * ```
   * const foo = { ...proxy };
   * ```
   */
  ownKeys: () => Property[];
}

export const createProxy = <T>(traps: ProxyTraps): Mock<T> =>
  // eslint-disable-next-line no-empty-function
  (new Proxy(/* istanbul ignore next */ () => {}, {
    get: (target, prop: string | symbol) => {
      if (prop === 'bind') {
        return (thisArg: any, ...args: any[]) => (...moreArgs: any[]) =>
          traps.apply([...args, ...moreArgs]);
      }

      if (prop === 'apply') {
        return (thisArg: any, args: any[] | undefined) =>
          traps.apply(args || []);
      }

      if (prop === 'call') {
        return (thisArg: any, ...args: any[]) => traps.apply(args);
      }

      return traps.property(prop);
    },

    apply: (target, thisArg: any, args: any[]) => traps.apply(args),

    ownKeys: () => traps.ownKeys(),

    getOwnPropertyDescriptor(
      target: () => void,
      prop: string | symbol
    ): PropertyDescriptor | undefined {
      const keys = traps.ownKeys();

      if (keys.includes(prop)) {
        return {
          configurable: true,
          enumerable: true,
        };
      }

      return undefined;
    },
  }) as unknown) as Mock<T>;
