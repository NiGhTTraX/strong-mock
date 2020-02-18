import { MissingMock } from './errors';
import { Mock, MockMap } from './mock';

export const instance = <T>(mock: Mock<T>): T => {
  function extracted(args: any[]) {
    const repo = MockMap.get(mock);

    if (!repo) {
      throw new MissingMock();
    }

    return repo.getMatchingExpectation(args).returnValue;
  }

  // @ts-ignore
  return (...args: any[]) => extracted(args);
};
