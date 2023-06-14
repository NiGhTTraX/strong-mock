import {
  EXPECTED_COLOR,
  printExpected,
  printReceived,
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
