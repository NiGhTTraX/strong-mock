import { singletonPendingExpectation } from './pending-expectation';

interface Stub<T> {
  returns(returnValue: T): void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
export const when = <R>(expectation: R): Stub<R> => {
  return {
    returns(returnValue: R): void {
      singletonPendingExpectation.finish(returnValue);
      singletonPendingExpectation.clear();
    }
  };
};
