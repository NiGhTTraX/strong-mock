import { Mock } from './mock';

interface ProxyTraps {
  /**
   * Called when mocking an object member or method.
   *
   * @example
   * ```
   * foo.bar
   * ```
   *
   * @example
   * ```
   * foo.baz(...args)
   * ```
   */
  get: (args: any[], property: string) => void;

  /**
   * Called when mocking a function.
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
  apply: (argArray: any | undefined) => void;
}

export const createProxy = <T>({ get, apply }: ProxyTraps): Mock<T> =>
  (new Proxy(() => {}, {
    get: (target, property: string) => {
      if (property === 'bind') {
        return (thisArg: any, ...args: any[]) => {
          return (...moreArgs: any[]) => apply([...args, ...moreArgs]);
        };
      }

      if (property === 'apply') {
        return (thisArg: any, args: any[]) => apply(args);
      }

      if (property === 'call') {
        return (thisArg: any, ...args: any[]) => apply(args);
      }

      return (...args: any[]) => {
        return get(args, property);
      };
    },

    apply: (target, thisArg: any, args?: any[]) => {
      return apply(args);
    }
  }) as unknown) as Mock<T>;
