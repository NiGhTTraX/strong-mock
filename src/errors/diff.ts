import { diff as printDiff } from 'jest-diff';
import { EXPECTED_COLOR, RECEIVED_COLOR } from 'jest-matcher-utils';
import type { Expectation } from '../expectation/expectation';
import { getMatcherDiffs } from '../matchers/matcher';

const noColor = (s: string) => s;

export const printArgsDiff = (
  expected: unknown[],
  actual: unknown[],
): string => {
  const diff = printDiff(expected, actual, {
    omitAnnotationLines: true,
    aColor: noColor,
    bColor: noColor,
    changeColor: noColor,
    commonColor: noColor,
    patchColor: noColor,
  });

  /* istanbul ignore next this is not expected in practice */
  if (!diff) {
    return '';
  }

  const diffLines = diff.split('\n');
  let relevantDiffLines: string[];

  // Strip Array [ ... ] surroundings.
  if (!expected.length) {
    // - Array []
    // + Array [
    //   ...
    // ]
    relevantDiffLines = diffLines.slice(2, -1);
  } else if (!actual.length) {
    // - Array [
    //   ...
    // ]
    // + Array []
    relevantDiffLines = diffLines.slice(1, -2);
  } else {
    // Array [
    //   ...
    // ]
    relevantDiffLines = diffLines.slice(1, -1);
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
    },
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
  actual: unknown[],
) =>
  expectations
    .map((e) => {
      const diff = printExpectationDiff(e, actual);

      if (diff) {
        return `${e.toString()}
${EXPECTED_COLOR('- Expected')}
${RECEIVED_COLOR('+ Received')}

${diff}`;
      }

      return undefined;
    })
    .filter((x) => x)
    .join('\n\n');
