import { diff as printDiff } from 'jest-diff';
import {
  EXPECTED_COLOR,
  printExpected,
  printReceived,
  RECEIVED_COLOR,
} from 'jest-matcher-utils';
import type { Expectation } from './expectation/expectation';
import { ApplyProp } from './expectation/expectation';
import { isMatcher } from './expectation/matcher';
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

export const printArg = (arg: unknown): string =>
  // Call toJSON on matchers directly to avoid wrapping them in quotes.
  isMatcher(arg) ? arg.toJSON() : printReceived(arg);

export const printCall = (property: Property, args: any[]) => {
  const prettyArgs = args.map((arg) => printArg(arg)).join(', ');
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

  return `.${thenPrefix}(${printExpected(value)}).between(${min}, ${max})`;
};

export const printWhen = (property: Property, args: any[] | undefined) => {
  if (args) {
    return `when(() => mock${printCall(property, args)})`;
  }

  return `when(() => mock${printProperty(property)})`;
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

export const printExpectationDiff = (e: Expectation, args: any[]) => {
  if (!e.args?.length) {
    return '';
  }

  const matcherDiffs = e.args?.map((matcher, j) => matcher.getDiff(args[j]));

  const diff = printDiff(
    matcherDiffs?.map((d) => d.expected),
    matcherDiffs?.map((d) => d.actual),
    { omitAnnotationLines: true }
  );

  if (!diff) {
    return '';
  }

  const diffLines = diff.split('\n').slice(1, -1);

  return `${diffLines.slice(0, -1).join('\n')}\n${diffLines[
    diffLines.length - 1
  ].slice(0, -6)}`;
};

export const printDiffForAllExpectations = (
  expectations: Expectation[],
  actual: any[]
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
