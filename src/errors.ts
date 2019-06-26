import { inspect } from 'util';
import { MethodExpectation, PropertyExpectation } from './index';

export class UnmetMethodExpectationError extends Error {
  constructor(property: string, expectation: MethodExpectation) {
    super(`Expected ${property} to be called with ${expectation}`);

    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, UnmetMethodExpectationError.prototype);
  }
}

export class UnmetPropertyExpectationError extends Error {
  constructor(property: string, expectation: PropertyExpectation) {
    super(`Expected ${property} to be called with ${expectation}`);

    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, UnmetPropertyExpectationError.prototype);
  }
}

export class UnexpectedMethodCallError extends Error {
  constructor(property: string, args: any[], expectations: MethodExpectation[]) {
    super(`${property} not expected to be called with ${inspect(args)}!

Existing expectations:
${expectations.join(' or ')}`);

    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, UnexpectedMethodCallError.prototype);
  }
}

export class UnexpectedAccessError extends Error {
  constructor(property: string) {
    super(`${property} not expected to be accessed`);

    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, UnexpectedAccessError.prototype);
  }
}
