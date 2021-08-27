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

let proxies = 1;

export const createProxy = <T>(traps: ProxyTraps, name?: string): Mock<T> => {
  proxies += 1;

  const proxyName = name || `mock#${proxies}`;

  // eslint-disable-next-line no-empty-function

  return (new Proxy(/* istanbul ignore next */ () => {
  }, {
    get: (target, prop: string | symbol) => {
      if (prop === '__mockName') {
        return proxyName;
      }

      if (prop === '__isMatcher') {
        return true;
      }

      if (prop === 'matches') {
        return (arg: any) => {
          if(!arg?.__mockName){
            return false;
          }

          return arg.__mockName === proxyName;
        };
      }

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
}
