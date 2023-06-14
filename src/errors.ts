import { EXPECTED_COLOR } from 'jest-matcher-utils';
import type { Expectation } from './expectation/expectation';
import type { CallMap } from './expectation/repository/expectation-repository';
import { printCall, printProperty, printRemainingExpectations } from './print';
import type { Property } from './proxy';

export class UnexpectedAccess extends Error {
  constructor(property: Property, expectations: Expectation[]) {
    super(`Didn't expect ${EXPECTED_COLOR(
      `mock${printProperty(property)}`
    )} to be accessed.

If you expect this property to be accessed then please
set an expectation for it.

${printRemainingExpectations(expectations)}`);
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
 * mergeCalls({ getData: [{ arguments: undefined }, { arguments: [1, 2, 3] }] }
 * // returns { getData: [{ arguments: [1, 2, 3] } }
 */
const mergeCalls = (callMap: CallMap): CallMap =>
  new Map(
    Array.from(callMap.entries()).map(([property, calls]) => {
      const hasMethodCalls = calls.some((call) => call.arguments);
      const hasPropertyAccesses = calls.some((call) => !call.arguments);

      if (hasMethodCalls && hasPropertyAccesses) {
        return [property, calls.filter((call) => call.arguments)];
      }

      return [property, calls];
    })
  );

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
