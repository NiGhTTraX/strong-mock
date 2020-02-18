import { MissingReturnValue } from './errors';
import { ExpectationRepository } from './expectation-repository';
import { MethodExpectation } from './expectations';

export const expectationRepository = Symbol('repo');

export type Mock<T> = T & { [expectationRepository]: ExpectationRepository };

let pendingReturn = false;
let pendingMock: Mock<unknown> | undefined;

export const strongMock = <T>(): Mock<T> => {
  const repo = new ExpectationRepository();
  pendingReturn = false;

  const stub = (((...args: any[]) => {
    pendingMock = stub;

    stub[expectationRepository].addExpectation(new MethodExpectation(args));
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

  pendingReturn = true;

  return {
    returns(returnValue: T): void {
      if (!pendingMock) {
        throw new Error('this should not happen');
      }

      pendingMock[expectationRepository].last.returnValue = returnValue;

      pendingReturn = false;
    }
  };
};
