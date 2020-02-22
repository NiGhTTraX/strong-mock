interface ProxyTraps {
  get: (args: any[], property: string) => any;
  apply: (argArray: any | undefined) => any;
}

export const createProxy = ({ get, apply }: ProxyTraps) =>
  new Proxy(() => {}, {
    get: (target, property: string) => {
      return (...args: any[]) => {
        return get(args, property);
      };
    },

    apply: (target: {}, thisArg: any, argArray?: any) => {
      return apply(argArray);
    }
  });
