import { pendingExpectation } from './pending-expectation';

interface Stub<T> {
  returns(returnValue: T): void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
export const when = <T>(expectation: T): Stub<T> => {
  return {
    returns(returnValue: T): void {
      pendingExpectation.finish(returnValue);
    }
  };
};
