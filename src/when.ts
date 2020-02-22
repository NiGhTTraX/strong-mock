import { MissingReturnValue, MissingWhen } from './errors';
import { MethodExpectation } from './expectations';
import { pendingMock } from './mock';

interface Stub<T> {
  returns(returnValue: T): void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
export const when = <T>(expectation: T): Stub<T> => {
  if (pendingMock.returnValue) {
    throw new MissingReturnValue();
  }

  pendingMock.returnValue = true;

  return {
    returns(returnValue: T): void {
      if (!pendingMock.repo || !pendingMock.args) {
        throw new MissingWhen();
      }

      pendingMock.repo.addExpectation(
        new MethodExpectation(
          pendingMock.args,
          returnValue,
          pendingMock.property
        )
      );

      pendingMock.repo = undefined;
      pendingMock.returnValue = false;
      pendingMock.args = undefined;
    }
  };
};
