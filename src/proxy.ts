interface ProxyTraps {
  get: (args: any[], property: string) => any;
  apply: (argArray: any | undefined) => any;
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

    apply: (target: {}, thisArg: any, argArray?: any) => {
      return apply(argArray);
    }
  });
