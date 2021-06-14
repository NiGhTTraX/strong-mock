import { Mock } from './mock';

export type Property = string | symbol;

interface ProxyTraps {
  /**
   * Called when accessing any property on an object, except for
   * `.call`, `.apply` and `.bind`.
   */
  property: (property: Property) => void;

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
  apply: (args: any[]) => void;
}

export const createProxy = <T>({ apply, property }: ProxyTraps): Mock<T> =>
  // eslint-disable-next-line no-empty-function
  (new Proxy(/* istanbul ignore next */ () => {}, {
    get: (target, prop: string | symbol) => {
      if (prop === 'bind') {
        return (thisArg: any, ...args: any[]) => (...moreArgs: any[]) =>
          apply([...args, ...moreArgs]);
      }

      if (prop === 'apply') {
        return (thisArg: any, args: any[] | undefined) => apply(args || []);
      }

      if (prop === 'call') {
        return (thisArg: any, ...args: any[]) => apply(args);
      }

      return property(prop);
    },

    apply: (target, thisArg: any, args: any[]) => apply(args),
  }) as unknown) as Mock<T>;
