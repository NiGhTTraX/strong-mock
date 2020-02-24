interface ProxyTraps {
  /**
   * Called when accessing any property other than `.call` and `.apply`.
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
  property: (property: string) => void;

  /**
   * Called when calling a method.
   *
   * @example
   * ```
   * foo.baz(...args)
   * ```
   */
  method: (args: any[], property: string) => void;

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

export const createProxy = <T>({ property, method, apply }: ProxyTraps) =>
  (new Proxy(() => {}, {
    get: (target, prop: string) => {
      if (prop !== 'call' && prop !== 'apply' && prop !== 'bind') {
        property(prop);
      }

      if (prop === 'bind') {
        return (thisArg: any, ...args: any[]) => {
          return (...moreArgs: any[]) => apply([...args, ...moreArgs]);
        };
      }

      return (...args: any[]) => {
        if (prop === 'apply') {
          return apply(args[1]);
        }

        if (prop === 'call') {
          return apply(args.slice(1));
        }

        return method(args, prop);
      };
    },

    apply: (target, thisArg: any, args?: any[]) => {
      return apply(args);
    }
  }) as unknown) as T;
