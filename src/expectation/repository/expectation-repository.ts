import type { Property } from '../../proxy.js';
import type { Expectation } from '../expectation.js';

export type Call = {
  arguments: any[] | undefined;
};

/**
 * Method calls should be recorded both as a property access and a method call.
 *
 * @example
 * // foo.bar(1, 2, 3) should generate
 * {
 *   foo: [
 *     { arguments: undefined },
 *     { arguments: [1, 2, 3] }
 *   ]
 * }
 */
export type CallMap = Map<Property, Call[]>;

export type CallStats = {
  /**
   * Calls that matched existing expectations.
   */
  expected: CallMap;

  /**
   * Calls that didn't match any existing expectation.
   */
  unexpected: CallMap;
};

export interface ExpectationRepository {
  mockName: string;

  add: (expectation: Expectation) => void;

  /**
   * Get a return value for the given property.
   *
   * The value might be a non-callable e.g. a number or a string, or it might
   * be a function that, upon receiving arguments, will start a new search and
   * return a value again.
   *
   * The list of expectations should be consulted from first to last when
   * getting a return value. If none of them match it is up to the
   * implementation to decide what to do.
   *
   * @example
   * add(new Expectation('getData', [1, 2], 23);
   * get('getData')(1, 2) === 23
   *
   * @example
   * add(new Expectation('hasData', undefined, true);
   * get('hasData') === true
   *
   * @example
   * add(new Expectation('getData', undefined, () => 42);
   * get('getData')(1, 2, '3', false, NaN) === 42
   */
  get: (property: Property) => unknown;

  /**
   * Get a return value for a function call.
   *
   * Note: this will only be invoked if the mocked type is a function. For
   * method property calls {@link get} will be called instead.
   *
   * The list of expectations should be consulted from first to last when
   * getting a return value. If none of them match it is up to the
   * implementation to decide what to do.
   *
   * @example
   * add(new Expectation(ApplyProp, [1, 2], 23);
   * apply(1, 2) === 23
   */
  apply: (args: unknown[]) => unknown;

  /**
   * Get all the properties that have expectations.
   *
   * @example
   * add(new Expectation('foo', undefined, 23));
   * getAllProperties() === ['foo']
   */
  getAllProperties: () => Property[];

  /**
   * Remove any expectations and clear the call stats.
   */
  clear: () => void;

  /**
   * Return all unmet expectations.
   */
  getUnmet: () => Expectation[];

  /**
   * Return all the calls that have been made so far.
   */
  getCallStats: () => CallStats;
}
