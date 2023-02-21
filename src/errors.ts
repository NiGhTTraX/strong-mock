import { DIM_COLOR, EXPECTED_COLOR, RECEIVED_COLOR } from 'jest-matcher-utils';
import type { Expectation } from './expectation/expectation';
import { getMatcherDiffs } from './expectation/matcher';
import type { CallMap } from './expectation/repository/expectation-repository';
import {
  printCall,
  printDiffForAllExpectations,
  printProperty,
  printRemainingExpectations,
} from './print';
import type { Property } from './proxy';
import type { PendingExpectation } from './when/pending-expectation';

export class UnfinishedExpectation extends Error {
  constructor(pendingExpectation: PendingExpectation) {
    super(`There is an unfinished pending expectation:

${pendingExpectation.toJSON()}

Please finish it by setting a return value even if the value
is undefined.`);
  }
}

export class MissingWhen extends Error {
  constructor() {
    super(`You tried setting a return value without an expectation.

Every call to set a return value must be preceded by an expectation.`);
  }
}

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

type MatcherResult = { expected: unknown; actual: unknown };

// This is taken from jest.
interface MatcherError {
  matcherResult?: MatcherResult;
}

export class UnexpectedCall extends Error implements MatcherError {
  public matcherResult?: MatcherResult;

  constructor(
    property: Property,
    args: unknown[],
    expectations: Expectation[]
  ) {
    const header = `Didn't expect mock${RECEIVED_COLOR(
      printCall(property, args, true)
    )} to be called.`;

    const propertyExpectations = expectations.filter(
      (e) => e.property === property
    );

    if (propertyExpectations.length) {
      super(
        DIM_COLOR(`${header}

Remaining expectations:
${printDiffForAllExpectations(propertyExpectations, args)}`)
      );

      // If we have a single expectation we can attach the actual/expected args
      // to the error instance, so that an IDE may show its own diff for them.
      if (
        propertyExpectations.length === 1 &&
        propertyExpectations[0].args?.length
      ) {
        const { actual, expected } = getMatcherDiffs(
          propertyExpectations[0].args,
          args
        );
        this.matcherResult = {
          actual,
          expected,
        };
      }
    } else {
      super(`${header}
      
No remaining expectations.`);
    }
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

export class NestedWhen extends Error {
  constructor(parentProp: Property, childProp: Property) {
    const snippet = `
const parentMock = mock<T1>();
const childMock = mock<T2>();

when(() => childMock${printProperty(childProp)}).thenReturn(...);
when(() => parentMock${printProperty(parentProp)}).thenReturn(childMock)
`;

    super(
      `Setting an expectation on a nested property is not supported.

You can return an object directly when the first property is accessed,
or you can even return a separate mock:
${snippet}`
    );
  }
}
