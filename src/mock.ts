import { MissingReturnValue } from './errors';
import { ExpectationRepository } from './expectation-repository';
import { MethodExpectation } from './expectations';

export const expectationRepository = Symbol('repo');

export type Mock<T> = T & { [expectationRepository]: ExpectationRepository };

let pendingReturn = false;
let pendingMock: Mock<any> | undefined;

export const strongMock = <T>(): Mock<T> => {
  const repo = new ExpectationRepository();
  pendingReturn = false;

  const stub = ((() => {
    pendingMock = stub;
  }) as unknown) as Mock<T>;

  stub[expectationRepository] = repo;

  return stub;
};

interface Stub<T> {
  returns(returnValue: T): void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
export const when = <T>(x: T): Stub<T> => {
  if (pendingReturn) {
    throw new MissingReturnValue();
  }

  const expectation = new MethodExpectation();
  pendingReturn = true;

  return {
    returns(returnValue: T): void {
      if (!pendingMock) {
        throw new Error('this should not happen');
      }

      expectation.returnValue = returnValue;
      pendingMock[expectationRepository].addExpectation(expectation);

      pendingReturn = false;
    }
  };
};
