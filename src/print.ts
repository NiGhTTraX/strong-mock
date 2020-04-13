import { EXPECTED_COLOR, printExpected } from 'jest-matcher-utils';
import { ApplyProp, Expectation, Expectation2 } from './expectation';
import { isMatcher } from './matcher';

export const printProperty = (property: PropertyKey) => {
  if (property === ApplyProp) {
    return '';
  }

  if (typeof property === 'symbol') {
    return `[${property.toString()}]`;
  }

  return `.${property}`;
};

export const printCall = (property: PropertyKey, args: any[]) => {
  // TODO: don't leak the matcher concept here
  const prettyArgs = args
    .map((a) => (isMatcher(a) ? a.toJSON() : printExpected(a)))
    .join(', ');
  const prettyProperty = printProperty(property);

  return `${prettyProperty}(${prettyArgs})`;
};

export const printReturns = (returnValue: any, min: number, max: number) =>
  `.${
    returnValue instanceof Error ? 'thenThrow' : 'thenReturn'
  }(${printExpected(
    returnValue instanceof Error ? returnValue.message : returnValue
  )}).between(${min}, ${max})`;

export const printWhen = (property: PropertyKey, args: any[] | undefined) => {
  if (args) {
    return `when(${EXPECTED_COLOR(`mock${printCall(property, args)}`)})`;
  }

  return `when(${EXPECTED_COLOR(`mock${printProperty(property)}`)})`;
};

export const printExpectation = (
  property: PropertyKey,
  args: any[] | undefined,
  returnValue: any,
  min: number,
  max: number
) => {
  return `${printWhen(property, args)}${printReturns(returnValue, min, max)}`;
};

export const printRemainingExpectations = (
  expectations: (Expectation | Expectation2)[]
) =>
  expectations.length
    ? `Remaining unmet expectations:
 - ${expectations.map((e) => e.toJSON()).join('\n - ')}`
    : 'There are no remaining unmet expectations.';
