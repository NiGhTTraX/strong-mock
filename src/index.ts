export type Mock<T> = T;

let pendingExpectation: MethodExpectation | undefined;

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
    }
  };
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
export const instance = <T>(mock: Mock<T>): T => {
  // @ts-ignore
  return () => pendingExpectation.returnValue;
};
