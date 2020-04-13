import { Expectation, Expectation2 } from './expectation';

export type ReturnValue = { returnValue: any };

export interface ExpectationRepository {
  /**
   * Add an expectation to the repo.
   */
  add(expectation: Expectation): void;

  /**
   * Get a return value for the given property/call.
   *
   * If there is an expectation matching the property and the args then its
   * return value should be chosen. Expectations should be matched in the order
   * they were added. Returning `undefined` means that no expectations matched.
   *
   * A repository implementation could decide to return a value here even if
   * no expectations matched.
   */
  get(property: PropertyKey, args: any[] | undefined): ReturnValue | undefined;

  /**
   * Does any _unmet_ expectation match the given key?
   */
  hasKey(property: PropertyKey): boolean;

  /**
   * Get all remaining unmet expectations.
   */
  getUnmet(): Expectation[];

  /**
   * Remove all expectations.
   */
  clear(): void;
}

export type Call = {
  arguments: any[] | undefined;
};

export type CallMap = Map<PropertyKey, Call[]>;

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

export interface ExpectationRepository2 {
  add(expectation: Expectation2): void;

  /**
   * Get a return value for the given property.
   *
   * The value might be a non-callable e.g. a number or a string or it might
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
  get(property: PropertyKey): any;

  /**
   * Remove any expectations and clear the call stats.
   */
  clear(): void;

  /**
   * Return all unmet expectations.
   */
  getUnmet(): Expectation2[];

  /**
   * Return all the calls that successfully returned a value so far.
   */
  getCallStats(): CallStats;
}
