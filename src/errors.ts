export class MissingReturnValue extends Error {
  constructor() {
    super(`You forgot to give a return value to the previous expectation`);
  }
}

export class UnexpectedCall extends Error {
  constructor() {
    super(`Didn't expect method to be called`);
  }
}
