import { inspect } from 'util';
import {
  Expectation,
  MethodExpectation,
  PropertyExpectation
} from './expectations';

const formatExpectationList = (expectations: Expectation[]) =>
  ` - ${expectations.join('\n - ')}`;

export class UnmetMethodExpectationError extends Error {
  constructor(
    method: string,
    unmetExpectation: MethodExpectation,
    expectations: MethodExpectation[]
  ) {
    super(`Expected ${method} to have been called with ${unmetExpectation.toString(
      false
    )}

Existing expectations:
${formatExpectationList(expectations)}`);

    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, UnmetMethodExpectationError.prototype);
  }
}

export class UnmetApplyExpectationError extends Error {
  constructor(
    unmetExpectation: MethodExpectation,
    expectations: MethodExpectation[]
  ) {
    super(`Expected function to have been called with ${unmetExpectation.toString(
      false
    )}

Existing expectations:
${formatExpectationList(expectations)}`);

    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, UnmetApplyExpectationError.prototype);
  }
}

export class UnmetPropertyExpectationError extends Error {
  constructor(
    property: string,
    unmetExpectation: PropertyExpectation,
    expectations: PropertyExpectation[]
  ) {
    super(`Expected ${property} to have been accessed ${unmetExpectation.toString(
      false
    )}

Existing expectations:
${formatExpectationList(expectations)}`);

    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, UnmetPropertyExpectationError.prototype);
  }
}

export class WrongMethodArgsError extends Error {
  constructor(
    property: string,
    args: any[],
    expectations: MethodExpectation[]
  ) {
    super(`${property} not expected to have been called with ${inspect(args)}!

Existing expectations:
${formatExpectationList(expectations)}`);

    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, WrongMethodArgsError.prototype);
  }
}

export class WrongApplyArgsError extends Error {
  constructor(args: any[], expectations: MethodExpectation[]) {
    super(`Function not expected to have been called with ${inspect(args)}!

Existing expectations:
${formatExpectationList(expectations)}`);

    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, WrongApplyArgsError.prototype);
  }
}

export class UnexpectedApplyError extends Error {
  constructor() {
    super('Function not expected to have been called!');

    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, UnexpectedApplyError.prototype);
  }
}

export class UnexpectedAccessError extends Error {
  constructor(property: string) {
    super(`${property} not expected to have been accessed`);

    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, UnexpectedAccessError.prototype);
  }
}
