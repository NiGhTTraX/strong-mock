import { MissingMock, MissingReturnValue, MissingWhen } from './errors';
import { ExpectationRepository } from './expectation-repository';
import { MethodExpectation } from './expectations';

export const MockMap = new Map<Mock<unknown>, ExpectationRepository>();

export type Mock<T> = T;

let pendingReturn = false;
let pendingMock: Mock<unknown> | undefined;
let pendingArgs: any[] | undefined;

export const strongMock = <T>(): Mock<T> => {
  const repo = new ExpectationRepository();
  pendingReturn = false;

  const stub = (((...args: any[]) => {
    pendingMock = stub;

    pendingArgs = args;
  }) as unknown) as Mock<T>;

  MockMap.set(stub, repo);

  return stub;
};

interface Stub<T> {
  returns(returnValue: T): void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
export const when = <T>(expectation: T): Stub<T> => {
  if (pendingReturn) {
    throw new MissingReturnValue();
  }

  pendingReturn = true;

  return {
    returns(returnValue: T): void {
      if (!pendingMock || !pendingArgs) {
        throw new MissingWhen();
      }

      const repo = MockMap.get(pendingMock);

      if (!repo) {
        throw new MissingMock();
      }

      repo.addExpectation(new MethodExpectation(pendingArgs, returnValue));

      pendingMock = undefined;
      pendingReturn = false;
      pendingArgs = undefined;
    }
  };
};
