type Mock<T> = T;

export const strongMock = <T>(): Mock<T> => ((() => {}) as unknown) as Mock<T>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
export const when = <T>(x: T) => {};
