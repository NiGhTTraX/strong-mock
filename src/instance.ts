import { MissingMock } from './errors';
import { Mock, MockMap } from './mock';
import { createProxy } from './proxy';

export const instance = <T>(mock: Mock<T>): T => {
  const repo = MockMap.get(mock);

  if (!repo) {
    throw new MissingMock();
  }

  return createProxy<T>({
    property: () => null,
    method: (args: any[], property: string) =>
      repo.getMatchingExpectation(args, property).returnValue,
    apply: (argArray: any | undefined) =>
      repo.getMatchingExpectation(argArray, '').returnValue
  });
};
