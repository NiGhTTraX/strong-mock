import { DIM_COLOR } from 'jest-matcher-utils';
import type { Expectation } from '../expectation/expectation.js';
import { getMatcherDiffs } from '../matchers/matcher.js';
import { printCall } from '../print.js';
import type { Property } from '../proxy.js';
import { printDiffForAllExpectations } from './diff.js';

type MatcherResult = {
  expected: unknown;
  actual: unknown;
};

// This should cover both jest and vitest.
interface MatcherError {
  expected?: unknown;
  actual?: unknown;
  matcherResult?: MatcherResult;
}

export class UnexpectedCall extends Error implements MatcherError {
  public matcherResult?: MatcherResult;
  public expected?: unknown;
  public actual?: unknown;

  constructor(
    property: Property,
    args: unknown[],
    expectations: Expectation[],
  ) {
    const header = `Didn't expect ${printCall(property, args)} to be called.`;

    const propertyExpectations = expectations.filter(
      (e) => e.property === property,
    );

    if (propertyExpectations.length) {
      super(
        DIM_COLOR(`${header}

Remaining expectations:
${printDiffForAllExpectations(propertyExpectations, args)}`),
      );

      // If we have a single expectation we can attach the actual/expected args
      // to the error instance, so that an IDE may show its own diff for them.
      if (
        propertyExpectations.length === 1 &&
        propertyExpectations[0].args?.length
      ) {
        const { actual, expected } = getMatcherDiffs(
          propertyExpectations[0].args,
          args,
        );
        this.actual = actual;
        this.expected = expected;
        this.matcherResult = {
          actual,
          expected,
        };
      }
    } else {
      super(
        DIM_COLOR(`${header}
      
No remaining expectations.`),
      );
    }
  }
}
