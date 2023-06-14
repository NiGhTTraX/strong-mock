import { diff as printDiff } from 'jest-diff';
import {
  EXPECTED_COLOR,
  printExpected,
  printReceived,
  RECEIVED_COLOR,
} from 'jest-matcher-utils';
import stripAnsi from 'strip-ansi';
import type { Expectation } from './expectation/expectation';
import { ApplyProp } from './expectation/expectation';
import { getMatcherDiffs, isMatcher } from './expectation/matcher';
import type { ReturnValue } from './expectation/repository/return-value';
import type { Property } from './proxy';

export const printProperty = (property: Property) => {
  if (property === ApplyProp) {
    return '';
  }

  if (typeof property === 'symbol') {
    return `[${property.toString()}]`;
  }

  return `.${property}`;
};

const printArg = (arg: unknown, received = false): string => {
  // Call toJSON on matchers directly to avoid wrapping strings returned by them in quotes.
  if (isMatcher(arg)) {
    return arg.toJSON();
  }

  return received ? printReceived(arg) : printExpected(arg);
};

export const printCall = (
  property: Property,
  args: any[],
  received = false // TODO: fix boolean trap
) => {
  const prettyArgs = args.map((arg) => printArg(arg, received)).join(', ');
  const prettyProperty = printProperty(property);

  return `${prettyProperty}(${prettyArgs})`;
};

export const printReturns = (
  { isError, isPromise, value }: ReturnValue,
  min: number,
  max: number
) => {
  let thenPrefix = '';

  if (isPromise) {
    if (isError) {
      thenPrefix += 'thenReject';
    } else {
      thenPrefix += 'thenResolve';
    }
  } else if (isError) {
    thenPrefix += 'thenThrow';
  } else {
    thenPrefix += 'thenReturn';
  }

  return `.${thenPrefix}(${printReceived(value)}).between(${min}, ${max})`;
};

export const printWhen = (property: Property, args: any[] | undefined) => {
  if (args) {
    return `when(() => mock${EXPECTED_COLOR(`${printCall(property, args)}`)})`;
  }

  return `when(() => mock${EXPECTED_COLOR(`${printProperty(property)}`)})`;
};

export const printExpectation = (
  property: Property,
  args: any[] | undefined,
  returnValue: ReturnValue,
  min: number,
  max: number
) => `${printWhen(property, args)}${printReturns(returnValue, min, max)}`;

export const printRemainingExpectations = (expectations: Expectation[]) =>
  expectations.length
    ? `Remaining unmet expectations:
 - ${expectations.map((e) => e.toJSON()).join('\n - ')}`
    : 'There are no remaining unmet expectations.';

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

  return [...relevantDiffLines.slice(0, -1), lastLine].join('\n');
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
