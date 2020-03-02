import { EXPECTED_COLOR, printExpected } from 'jest-matcher-utils';
import { Expectation } from './expectation';
import { ApplyProp } from './mock';

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
  const prettyArgs = args.map(printExpected).join(', ');
  const prettyProperty = printProperty(property);

  return `${prettyProperty}(${prettyArgs})`;
};

export const printReturns = (returnValue: any, min: number, max: number) =>
  `.returns(${printExpected(returnValue)}).between(${min}, ${max})`;

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

export const printRemainingExpectations = (expectations: Expectation[]) =>
  expectations.length
    ? `Remaining unmet expectations:
 - ${expectations.map(e => e.toString()).join('\n - ')}`
    : 'There are no remaining unmet expectations.';
