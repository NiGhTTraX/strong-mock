import { Expectation } from './expectation';

export interface ExpectationRepository {
  /**
   * Add expectation to the repo.
   */
  add(expectation: Expectation): void;

  /**
   * Find a matching expectation and consume it.
   */
  findAndConsume(
    property: PropertyKey,
    args: any[] | undefined
  ): Expectation | undefined;

  /**
   * Does any expectation exist for the given property?
   */
  hasFor(property: PropertyKey): boolean;

  /**
   * Get all remaining unmet expectations.
   */
  getUnmet(): Expectation[];

  clear(): void;
}

/**
 * Expectations will be returned in the order they were added.
 */
export class FIFORepository implements ExpectationRepository {
  private repo: Expectation[] = [];

  add(expectation: Expectation) {
    this.repo.push(expectation);
  }

  /**
   * @returns If nothing matches will return `undefined`.
   */
  findAndConsume(property: PropertyKey, args: any[] | undefined) {
    const expectation = this.repo.find(e => e.matches(property, args));

    if (expectation) {
      this.consume(expectation);
    }

    return expectation;
  }

  hasFor(property: PropertyKey) {
    return !!this.repo.find(e => e.property === property);
  }

  getUnmet() {
    return this.repo.filter(e => e.min > 0);
  }

  clear(): void {
    this.repo = [];
  }

  private consume(expectation: Expectation) {
    // eslint-disable-next-line no-param-reassign
    expectation.min--;
    // eslint-disable-next-line no-param-reassign
    expectation.max--;

    if (expectation.max === 0) {
      this.repo = this.repo.filter(e => e !== expectation);
    }
  }
}
