import { MissingMock } from './errors';
import { Mock, MockMap } from './mock';
import { createProxy } from './proxy';

export const instance = <T>(mock: Mock<T>): T => {
  const repo = MockMap.get(mock);

  if (!repo) {
    throw new MissingMock();
  }

  const proxy = createProxy({
    method: (args: any[], property: string) =>
      repo.getMatchingExpectation(args, property).returnValue,
    property: (property: string) => {
      return (...args: any[]) => {
        return repo.getMatchingExpectation(args, property).returnValue;
      };
    },
    apply: (argArray: any | undefined) =>
      repo.getMatchingExpectation(argArray, '').returnValue
  });

  return (proxy as unknown) as Mock<T>;
};
