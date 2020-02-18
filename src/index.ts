export type Mock<T> = T;

let pendingExpectation = 0;

export class MissingReturnValue extends Error {
  constructor() {
    super(`You forgot to give a return value to the previous expectation`);
  }
}

export const strongMock = <T>(): Mock<T> => {
  pendingExpectation = 0;

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
  pendingExpectation = 1;

  return {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
    returns(returnValue: T): void {}
  };
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
export const instance = <T>(mock: Mock<T>): T => {
  // @ts-ignore
  return () => {};
};
