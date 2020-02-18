export type Mock<T> = T;

let pendingExpectation: MethodExpectation | undefined;

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

const repo = new ExpectationRepository();

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

  return ((() => {}) as unknown) as Mock<T>;
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
      if (!pendingExpectation) {
        throw new Error('this should not happen');
      }

      pendingExpectation.returnValue = returnValue;
      repo.addExpectation(pendingExpectation);
      pendingExpectation = undefined;
    }
  };
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
export const instance = <T>(mock: Mock<T>): T => {
  function extracted() {
    return repo.getMatchingExpectation().returnValue;
  }

  // @ts-ignore
  return () => extracted();
};
