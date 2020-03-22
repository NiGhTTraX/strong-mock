import { Expectation } from './expectation';

export interface ExpectationRepository {
  /**
   * Add an expectation to the repo.
   */
  add(expectation: Expectation): void;

  /**
   * Find a matching expectation.
   *
   * The order in which expectations are returned depends on the implementation.
   */
  // TODO: return just the expectation's returnValue
  find(property: PropertyKey, args: any[] | undefined): Expectation | undefined;

  /**
   * Does any expectation exist for the given property?
   */
  hasFor(property: PropertyKey): boolean;

  /**
   * Get all remaining unmet expectations.
   */
  getUnmet(): Expectation[];

  /**
   * Remove all expectations.
   */
  clear(): void;
}
