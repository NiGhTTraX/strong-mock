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

export const createProxy = ({ get, apply }: ProxyTraps) =>
  new Proxy(() => {}, {
    get: (target, property: string) => {
      return (...args: any[]) => {
        if (property === 'apply') {
          return apply(args[1]);
        }

        if (property === 'call') {
          return apply(args.slice(1));
        }

        return get(args, property);
      };
    },

    apply: (target, thisArg: any, args?: any[]) => {
      return apply(args);
    }
  });
