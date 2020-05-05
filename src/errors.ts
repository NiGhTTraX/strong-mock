import { EXPECTED_COLOR } from 'jest-matcher-utils';
import { Expectation } from './expectation';
import { CallMap } from './expectation-repository';
import { PendingExpectation } from './pending-expectation';
import { printCall, printProperty, printRemainingExpectations } from './print';

export class UnfinishedExpectation extends Error {
  constructor(pendingExpectation: PendingExpectation) {
    super(`There is an unfinished pending expectation:

${pendingExpectation.toJSON()}

Please finish it by setting a return value even if the value
is undefined.

This may have been caused by using the mock without getting
an instance from it first. Please use instance(mock) and use
that value in the code you're testing.`);
  }
}

export class MissingWhen extends Error {
  constructor() {
    super(`You tried setting a return value without an expectation.

Every call to set a return value must be preceded by an expectation.`);
  }
}

export class UnexpectedAccess extends Error {
  constructor(property: PropertyKey, expectations: Expectation[]) {
    super(`Didn't expect ${EXPECTED_COLOR(
      `mock${printProperty(property)}`
    )} to be accessed.

If you expect this property to be accessed then please
set an expectation for it.

${printRemainingExpectations(expectations)}`);
  }
}

export class UnexpectedCall extends Error {
  constructor(property: PropertyKey, args: any[], expectations: Expectation[]) {
    super(`Didn't expect ${EXPECTED_COLOR(
      `mock${printCall(property, args)}`
    )} to be called.

${printRemainingExpectations(expectations)}`);
  }
}

export class NotAMock extends Error {
  constructor() {
    super(`We couldn't find the mock.

Make sure you're passing in an actual mock.`);
  }
}

export class UnmetExpectations extends Error {
  constructor(expectations: Expectation[]) {
    super(`There are unmet expectations:

 - ${expectations.map((e) => e.toJSON()).join('\n - ')}`);
  }
}

/**
 * Merge property accesses and method calls for the same property
 * into a single call.
 *
 * @example
 * mergeCalls({ foo: [{ arguments: undefined }, { arguments: [1, 2, 3] }] }
 * // returns { foo: [{ arguments: [1, 2, 3] } }
 */
const mergeCalls = (callMap: CallMap): CallMap => {
  return new Map(
    Array.from(callMap.entries()).map(([property, calls]) => {
      const hasMethodCalls = calls.some((call) => call.arguments);
      const hasPropertyAccesses = calls.some((call) => !call.arguments);

      if (hasMethodCalls && hasPropertyAccesses) {
        return [property, calls.filter((call) => call.arguments)];
      }

      return [property, calls];
    })
  );
};

export class UnexpectedCalls extends Error {
  constructor(unexpectedCalls: CallMap, expectations: Expectation[]) {
    const printedCalls = Array.from(mergeCalls(unexpectedCalls).entries())
      .map(([property, calls]) =>
        calls
          .map((call) =>
            call.arguments
              ? EXPECTED_COLOR(`mock${printCall(property, call.arguments)}`)
              : EXPECTED_COLOR(`mock${printProperty(property)}`)
          )
          .join('\n - ')
      )
      .join('\n - ');

    super(`The following calls were unexpected:

 - ${printedCalls}

${printRemainingExpectations(expectations)}`);
  }
}
