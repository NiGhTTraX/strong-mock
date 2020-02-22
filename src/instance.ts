import { MissingMock } from './errors';
import { Mock, MockMap } from './mock';
import { createProxy } from './proxy';

export const instance = <T>(mock: Mock<T>): T => {
  const repo = MockMap.get(mock);

  if (!repo) {
    throw new MissingMock();
  }

  const proxy = createProxy({
    get: (args: any[], property: string) =>
      repo.methods.getMatchingExpectation(args, property).returnValue,
    apply: (argArray: any | undefined) =>
      repo.apply.getMatchingExpectation(argArray, '').returnValue
  });

  return (proxy as unknown) as Mock<T>;
};
