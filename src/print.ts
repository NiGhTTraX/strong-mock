import { EXPECTED_COLOR, RECEIVED_COLOR, stringify } from 'jest-matcher-utils';
import type { Expectation } from './expectation/expectation.js';
import { ApplyProp } from './expectation/expectation.js';
import type { ReturnValue } from './expectation/repository/return-value.js';
import { isMatcher } from './matchers/matcher.js';
import type { Property } from './proxy.js';

export const printProperty = (property: Property) => {
  if (property === ApplyProp) {
    return '';
  }

  if (typeof property === 'symbol') {
    return `[${property.toString()}]`;
  }

  return `.${property}`;
};

export const printValue = (arg: unknown): string => {
  // Call toString on matchers directly to avoid wrapping strings returned by them in quotes.
  if (isMatcher(arg)) {
    return arg.toString();
  }

  return stringify(arg);
};

const printArgs = (args: any[]) =>
  args.map((arg) => printValue(arg)).join(', ');

export const printCall = (property: Property, args?: any[]) => {
  const prettyProperty = printProperty(property);

  if (args) {
    const prettyArgs = printArgs(args);

    return `mock${RECEIVED_COLOR(`${prettyProperty}(${prettyArgs})`)}`;
  }

  return `mock${RECEIVED_COLOR(`${prettyProperty}`)}`;
};

export const printReturns = (
  { isError, isPromise, value }: ReturnValue,
  min: number,
  max: number,
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

  return `.${thenPrefix}(${RECEIVED_COLOR(
    printValue(value),
  )}).between(${min}, ${max})`;
};

export const printWhen = (property: Property, args: any[] | undefined) => {
  const prettyProperty = printProperty(property);

  if (args) {
    return `when(() => mock${EXPECTED_COLOR(
      `${prettyProperty}(${printArgs(args)})`,
    )})`;
  }

  return `when(() => mock${EXPECTED_COLOR(`${printProperty(property)}`)})`;
};

export const printExpectation = (
  property: Property,
  args: any[] | undefined,
  returnValue: ReturnValue,
  min: number,
  max: number,
) => `${printWhen(property, args)}${printReturns(returnValue, min, max)}`;

export const printRemainingExpectations = (expectations: Expectation[]) =>
  expectations.length
    ? `Remaining unmet expectations:
 - ${expectations.map((e) => e.toString()).join('\n - ')}`
    : 'There are no remaining unmet expectations.';
