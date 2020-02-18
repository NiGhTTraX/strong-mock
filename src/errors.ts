import { printExpected } from 'jest-matcher-utils';
import { Expectation } from './expectations';
import { isMatcher } from './matcher';
import { MethodExpectation } from './method-expectation';
import { PropertyExpectation } from './property-expectation';

const formatExpectationList = (expectations: Expectation[]) =>
  ` - ${expectations.join('\n - ')}`;

export function formatExpectedArgs(args: any[]) {
  if (!args.length) {
    return printExpected('no arguments');
  }

  return args
    .map(a => {
      return printExpected(isMatcher(a) ? a.toString() : a);
    })
    .join(', ');
}

/**
 * Thrown by `verifyAll` when a method has remaining unmet expectations.
 */
export class UnmetMethodExpectationError extends Error {
  constructor(
    method: string,
    unmetExpectation: MethodExpectation,
    expectations: MethodExpectation[]
  ) {
    super(`Expected ${printExpected(
      method
    )} to have been called with ${unmetExpectation.toString(false)}

Existing expectations:
${formatExpectationList(expectations)}`);

    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, UnmetMethodExpectationError.prototype);
  }
}

/**
 * Thrown by `verifyAll` when a function has remaining unmet expectations.
 */
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

/**
 * Thrown by `verifyAll` when a property has remaining unmet expectations.
 */
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

/**
 * Thrown when a method is called with arguments not matching any expectation.
 */
export class WrongMethodArgsError extends Error {
  constructor(
    property: string,
    args: any[],
    expectations: MethodExpectation[]
  ) {
    super(`${printExpected(
      property
    )} not expected to have been called with ${formatExpectedArgs(args)}

Existing expectations:
${formatExpectationList(expectations)}`);

    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, WrongMethodArgsError.prototype);
  }
}

/**
 * Thrown when a function is called with arguments not matching any expectation.
 */
export class WrongApplyArgsError extends Error {
  constructor(args: any[], expectations: MethodExpectation[]) {
    super(`Function not expected to have been called with ${formatExpectedArgs(
      args
    )}

Existing expectations:
${formatExpectationList(expectations)}`);

    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, WrongApplyArgsError.prototype);
  }
}

/**
 * Thrown when a function is called and there are no expectations for it.
 */
export class UnexpectedApplyError extends Error {
  constructor() {
    super('Function not expected to have been called');

    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, UnexpectedApplyError.prototype);
  }
}

/**
 * Thrown when either a method is called and there are no expectations for it
 * or a property is accessed and there are no expectations for it.
 *
 * The 2 cases can't be distinguished because the ES6 proxy traps them both
 * in the same way: as a property access. In the trap handler we don't know
 * if this should be just a member or if it should be a method.
 */
export class UnexpectedAccessError extends Error {
  constructor(property: string) {
    super(`${property} not expected to have been accessed`);

    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, UnexpectedAccessError.prototype);
  }
}
