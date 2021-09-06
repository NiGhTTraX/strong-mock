import { EXPECTED_COLOR, printExpected } from 'jest-matcher-utils';
import { ApplyProp, Expectation, ReturnValue } from './expectation/expectation';
import { isMatcher } from './expectation/matcher';
import { Property } from './proxy';

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
  isMatcher(arg) ? arg.toJSON() : printExpected(arg);

export const printCall = (property: Property, args: any[]) => {
  // TODO: don't leak the matcher concept here
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
    return `when(${EXPECTED_COLOR(`mock${printCall(property, args)}`)})`;
  }

  return `when(${EXPECTED_COLOR(`mock${printProperty(property)}`)})`;
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
