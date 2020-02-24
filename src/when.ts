import { PendingExpectation } from './pending-expectation';

interface Stub<T> {
  returns(returnValue: T): void;
}

export const when = <R>(expectation: R): Stub<R> => {
  // Here be dragons: we type this method to infer the return type from
  // the mocked type, but secretly we know that any access to it will
  // return a pending expectation that we're supposed to finish.
  const pendingExpectation = (expectation as unknown) as PendingExpectation;

  return {
    returns(returnValue: R): void {
      pendingExpectation.finish(returnValue);
    }
  };
};
