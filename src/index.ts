const expectationRepository = Symbol('repo');

export type Mock<T> = T & { [expectationRepository]: ExpectationRepository };

class ExpectationRepository {
  private repo: MethodExpectation[] = [];

  addExpectation(expectation: MethodExpectation) {
    this.repo.push(expectation);
  }

  getMatchingExpectation() {
    const methodExpectation = this.repo[0];
    this.repo.splice(0, 1);
    return methodExpectation;
  }
}

let pendingExpectation: MethodExpectation | undefined;
let pendingRepo: ExpectationRepository | undefined;

export class MissingReturnValue extends Error {
  constructor() {
    super(`You forgot to give a return value to the previous expectation`);
  }
}

class MethodExpectation {
  public returnValue: any;

  constructor() {}
}

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
export const instance = <T>(mock: Mock<T>): T => {
  function extracted() {
    return mock[expectationRepository].getMatchingExpectation().returnValue;
  }

  // @ts-ignore
  return () => extracted();
};
