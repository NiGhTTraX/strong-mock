import { ExpectationRepository } from './expectation-repository';
import { Mock, repoHolder } from './mock';

interface ProxyTraps<T> {
  /**
   * Called when accessing any property on an object, except for
   * `.call`, `.apply` and `.bind`.
   */
  property: (property: keyof T) => void;

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

export const createProxy = <T>(
  repository: ExpectationRepository,
  { apply, property }: ProxyTraps<T>
): Mock<T> =>
  (new Proxy(() => {}, {
    get: (target, prop: keyof T) => {
      if (prop === repoHolder) {
        return repository;
      }

      if (prop === 'bind') {
        return (thisArg: any, ...args: any[]) => {
          return (...moreArgs: any[]) => apply([...args, ...moreArgs]);
        };
      }

      if (prop === 'apply') {
        return (thisArg: any, args: any[]) => apply(args);
      }

      if (prop === 'call') {
        return (thisArg: any, ...args: any[]) => apply(args);
      }

      return property(prop);
    },

    apply: (target, thisArg: any, args: any[]) => {
      return apply(args);
    }
  }) as unknown) as Mock<T>;
