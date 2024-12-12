import { DIM_COLOR } from 'jest-matcher-utils';
import type { Expectation } from '../expectation/expectation';
import type { CallMap } from '../expectation/repository/expectation-repository';
import { printCall, printRemainingExpectations } from '../print';

export class UnmetExpectations extends Error {
  constructor(expectations: Expectation[]) {
    super(
      DIM_COLOR(`There are unmet expectations:

 - ${expectations.map((e) => e.toString()).join('\n - ')}`),
    );
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
    }),
  );

export class UnexpectedCalls extends Error {
  constructor(unexpectedCalls: CallMap, expectations: Expectation[]) {
    const printedCalls = Array.from(mergeCalls(unexpectedCalls).entries())
      .map(([property, calls]) =>
        calls.map((call) => printCall(property, call.arguments)).join('\n - '),
      )
      .join('\n - ');

    super(
      DIM_COLOR(`The following calls were unexpected:

 - ${printedCalls}

${printRemainingExpectations(expectations)}`),
    );
  }
}
