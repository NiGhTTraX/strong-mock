import { EXPECTED_COLOR } from 'jest-matcher-utils';
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
  const prettyArgs = args.join(', ');
  const prettyProperty = printProperty(property);

  return `${prettyProperty}(${prettyArgs})`;
};

export const printReturns = (returnValue: any, min: number, max: number) =>
  `.returns(${returnValue}).between(${min}, ${max})`;

export const printWhen = (property: PropertyKey, args: any[] | undefined) => {
  if (args) {
    return `when(mock${EXPECTED_COLOR(printCall(property, args))})`;
  }

  return `when(mock${EXPECTED_COLOR(printProperty(property))})`;
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
