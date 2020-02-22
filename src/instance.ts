import { MissingMock } from './errors';
import { ExpectationRepository } from './expectation-repository';
import { Mock, MockMap } from './mock';

function createProxy(repo: ExpectationRepository) {
  return new Proxy(() => {}, {
    get: (target, property: string) => {
      return (...args: any[]) => {
        return repo.methods.getMatchingExpectation(args, property).returnValue;
      };
    },

    apply: (target: {}, thisArg: any, argArray?: any) => {
      return repo.apply.getMatchingExpectation(argArray, '').returnValue;
    }
  });
}

export const instance = <T>(mock: Mock<T>): T => {
  const repo = MockMap.get(mock);

  if (!repo) {
    throw new MissingMock();
  }

  const proxy = createProxy(repo);

  return (proxy as unknown) as Mock<T>;
};
