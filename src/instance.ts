// eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
import { UnexpectedCall } from './errors';
import { expectationRepository, Mock } from './mock';

export const instance = <T>(mock: Mock<T>): T => {
  function extracted(args: any[]) {
    const expectation = mock[expectationRepository].getMatchingExpectation(
      args
    );

    if (!expectation) {
      throw new UnexpectedCall();
    }
    return expectation.returnValue;
  }

  // @ts-ignore
  return (...args: any[]) => extracted(args);
};
