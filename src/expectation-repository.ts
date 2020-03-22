import { Expectation } from './expectation';

export interface ExpectationRepository {
  /**
   * Add an expectation to the repo.
   */
  add(expectation: Expectation): void;

  /**
   * Get a matching expectation.
   *
   * The order in which expectations are returned depends on the implementation.
   * Returning `undefined` means that no expectations match.
   */
  get(property: PropertyKey, args: any[] | undefined): Expectation | undefined;

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
