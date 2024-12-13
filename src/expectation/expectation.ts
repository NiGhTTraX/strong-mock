import type { Matcher } from '../matchers/matcher.js';
import type { Property } from '../proxy.js';
import type { ReturnValue } from './repository/return-value.js';

/**
 * Compare received arguments against matchers.
 */
export interface Expectation {
  property: Property;

  /**
   * `undefined` means this is a property expectation.
   * `[]` means this is a function call with no arguments.
   */
  args: Matcher[] | undefined;

  returnValue: ReturnValue;

  min: number;

  max: number;

  /**
   * How many times should this expectation match?
   */
  setInvocationCount: (min: number, max: number) => void;

  matches: (args: unknown[] | undefined) => boolean;

  toString: () => string;
}

/**
 * Special symbol denoting the call of a function.
 */
export const ApplyProp = Symbol('apply');
