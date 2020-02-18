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

// eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
export const when = <T>(x: T) => {
  if (pendingExpectation) {
    throw new MissingReturnValue();
  }
  pendingExpectation = 1;
};
