import { diff as printDiff } from 'jest-diff';
import { DIM_COLOR, EXPECTED_COLOR, RECEIVED_COLOR } from 'jest-matcher-utils';
import stripAnsi from 'strip-ansi';
import type { Expectation } from '../expectation/expectation';
import { getMatcherDiffs } from '../matchers/matcher';
import { printCall } from '../print';
import type { Property } from '../proxy';

type MatcherResult = {
  expected: unknown;
  actual: unknown;
};

// This is taken from jest.
interface MatcherError {
  matcherResult?: MatcherResult;
}

export const printArgsDiff = (
  expected: unknown[],
  actual: unknown[]
): string => {
  const diff = printDiff(expected, actual, { omitAnnotationLines: true });

  /* istanbul-ignore-next this is not expected in practice */
  if (!diff) {
    return '';
  }

  const ansilessDiffLines = stripAnsi(diff).split('\n');
  let relevantDiffLines: string[];

  // Strip Array [ ... ] surroundings.
  if (!expected.length) {
    // - Array []
    // + Array [
    //   ...
    // ]
    relevantDiffLines = ansilessDiffLines.slice(2, -1);
  } else if (!actual.length) {
    // - Array [
    //   ...
    // ]
    // + Array []
    relevantDiffLines = ansilessDiffLines.slice(1, -2);
  } else {
    // Array [
    //   ...
    // ]
    relevantDiffLines = ansilessDiffLines.slice(1, -1);
  }

  // Strip the trailing comma.
  const lastLine = relevantDiffLines[relevantDiffLines.length - 1].slice(0, -1);

  const coloredDiffLines = [...relevantDiffLines.slice(0, -1), lastLine].map(
    (line) => {
      const first = line.charAt(0);

      switch (first) {
        case '-':
          return EXPECTED_COLOR(line);
        case '+':
          return RECEIVED_COLOR(line);
        default:
          return line;
      }
    }
  );

  return coloredDiffLines.join('\n');
};

export const printExpectationDiff = (e: Expectation, args: unknown[]) => {
  if (!e.args?.length) {
    return '';
  }

  const { actual, expected } = getMatcherDiffs(e.args, args);

  return printArgsDiff(expected, actual);
};

export const printDiffForAllExpectations = (
  expectations: Expectation[],
  actual: unknown[]
) =>
  expectations
    .map((e) => {
      const diff = printExpectationDiff(e, actual);

      if (diff) {
        return `${e.toJSON()}
${EXPECTED_COLOR('- Expected')}
${RECEIVED_COLOR('+ Received')}

${diff}`;
      }

      return undefined;
    })
    .filter((x) => x)
    .join('\n\n');

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
