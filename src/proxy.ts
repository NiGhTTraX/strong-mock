import type { Mock } from './mock/mock';

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
  apply: (args: unknown[]) => unknown;

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
  // The Proxy target MUST be a function, otherwise we can't use the `apply` trap:
  // https://262.ecma-international.org/6.0/#sec-proxy-object-internal-methods-and-internal-slots-call-thisargument-argumentslist
  // eslint-disable-next-line no-empty-function,@typescript-eslint/no-empty-function
  new Proxy(/* istanbul ignore next */ () => {}, {
    get: (target, prop: string | symbol) => {
      if (prop === 'bind') {
        return (thisArg: unknown, ...args: unknown[]) =>
          (...moreArgs: unknown[]) =>
            traps.apply([...args, ...moreArgs]);
      }

      if (prop === 'apply') {
        return (thisArg: unknown, args: unknown[] | undefined) =>
          traps.apply(args || []);
      }

      if (prop === 'call') {
        return (thisArg: unknown, ...args: unknown[]) => traps.apply(args);
      }

      return traps.property(prop);
    },

    apply: (target, thisArg: unknown, args: unknown[]) => traps.apply(args),

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
  }) as unknown as Mock<T>;
