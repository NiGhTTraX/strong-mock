import { DIM_COLOR } from 'jest-matcher-utils';
import type { Expectation } from '../expectation/expectation';
import { getMatcherDiffs } from '../matchers/matcher';
import { printCall } from '../print';
import type { Property } from '../proxy';
import { printDiffForAllExpectations } from './diff';

type MatcherResult = {
  expected: unknown;
  actual: unknown;
};

// This is taken from jest.
interface MatcherError {
  matcherResult?: MatcherResult;
}

export class UnexpectedCall extends Error implements MatcherError {
  public matcherResult?: MatcherResult;

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
