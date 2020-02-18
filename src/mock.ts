import { MissingReturnValue } from './errors';
import { ExpectationRepository } from './expectation-repository';
import { MethodExpectation } from './expectations';

export const expectationRepository = Symbol('repo');

export type Mock<T> = T & { [expectationRepository]: ExpectationRepository };

let pendingExpectation: MethodExpectation | undefined;
let pendingRepo: ExpectationRepository | undefined;

export const strongMock = <T>(): Mock<T> => {
  pendingExpectation = undefined;

  const repo = new ExpectationRepository();

  const stub = ((() => {
    pendingRepo = repo;
  }) as unknown) as Mock<T>;

  stub[expectationRepository] = repo;

  return stub;
};

interface Stub<T> {
  returns(returnValue: T): void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
export const when = <T>(x: T): Stub<T> => {
  if (pendingExpectation) {
    throw new MissingReturnValue();
  }

  pendingExpectation = new MethodExpectation();

  return {
    returns(returnValue: T): void {
      if (!pendingExpectation || !pendingRepo) {
        throw new Error('this should not happen');
      }

      pendingExpectation.returnValue = returnValue;
      pendingRepo.addExpectation(pendingExpectation);
      pendingExpectation = undefined;
    }
  };
};
