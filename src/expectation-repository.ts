import { Expectation } from './expectation';

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
