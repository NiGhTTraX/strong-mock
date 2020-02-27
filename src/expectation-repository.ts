import isEqual from 'lodash/isEqual';
import { Expectation } from './expectations';

export interface ExpectationRepository {
  /**
   * Add expectation to the end of the repo.
   */
  add(expectation: Expectation): void;

  /**
   * Find the first matching expectation.
   */
  find(args: any[] | undefined, property: string): Expectation | undefined;
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
  find(args: any[] | undefined, property: string): Expectation | undefined {
    const expectation = this.repo.find(
      e => e.property === property && this.compareArgs(e, args)
    );

    if (expectation) {
      this.consume(expectation);
    }

    return expectation;
  }

  // eslint-disable-next-line class-methods-use-this
  private compareArgs(e: Expectation, args: any[] | undefined) {
    if (!args && !e.args) {
      return true;
    }

    if (!args || !e.args) {
      return false;
    }

    return e.args.every((a, i) => isEqual(a, args[i]));
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
