export class MissingReturnValue extends Error {
  constructor() {
    super(`You forgot to give a return value to the previous expectation`);
  }
}

export class MissingWhen extends Error {
  constructor() {
    super(`You didn't set an expectation first`);
  }
}

export class UnexpectedCall extends Error {
  constructor(property: PropertyKey) {
    super(`Didn't expect method ${property.toString()} to be called`);
  }
}

export class NotAMock extends Error {
  constructor() {
    super(`This is not a mock`);
  }
}

export class UnmetExpectation extends Error {}
