import { UnexpectedCall, MissingMock } from './errors';
import { Mock, MockMap } from './mock';

export const instance = <T>(mock: Mock<T>): T => {
  function extracted(args: any[]) {
    const repo = MockMap.get(mock);

    if (!repo) {
      throw new MissingMock();
    }

    const expectation = repo.getMatchingExpectation(args);

    if (!expectation) {
      throw new UnexpectedCall();
    }
    return expectation.returnValue;
  }

  // @ts-ignore
  return (...args: any[]) => extracted(args);
};
