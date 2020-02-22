import { pendingMock } from './pending-mock';

interface Stub<T> {
  returns(returnValue: T): void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
export const when = <T>(expectation: T): Stub<T> => {
  return {
    returns(returnValue: T): void {
      pendingMock.finish(returnValue);
    }
  };
};
