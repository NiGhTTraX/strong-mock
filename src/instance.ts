import { MissingMock } from './errors';
import { Mock, MockMap } from './mock';

export const instance = <T>(mock: Mock<T>): T => {
  const repo = MockMap.get(mock);

  if (!repo) {
    throw new MissingMock();
  }

  const proxy = new Proxy(() => {}, {
    get: (target, property: string) => {
      return (...args: any[]) => {
        return repo.methods.getMatchingExpectation(args, property).returnValue;
      };
    },

    apply: (target: {}, thisArg: any, argArray?: any) => {
      return repo.apply.getMatchingExpectation(argArray, '').returnValue;
    }
  });

  return (proxy as unknown) as Mock<T>;
};
