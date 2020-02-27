import isEqual from 'lodash/isEqual';
import { UnexpectedCall } from './errors';
import { Expectation } from './expectations';

export class ExpectationRepository {
  private repo: Expectation[] = [];

  /**
   * Add expectation to the end of the repo.
   */
  add(expectation: Expectation) {
    this.repo.push(expectation);
  }

  /**
   * Remove the given expectation from the repo.
   * @param expectation
   */
  remove(expectation: Expectation) {
    this.repo = this.repo.filter(e => e !== expectation);
  }

  /**
   * Find the first matching expectation.
   *
   * @returns If nothing matches will return `undefined`.
   */
  findFirst(
    args: any[] | undefined,
    property: string
  ): Expectation | undefined {
    const expectation = this.repo.find(
      e => e.property === property && this.compareArgs(e, args)
    );

    if (expectation) {
      this.remove(expectation);
    }

    return expectation;
  }

  /**
   * Get the first matching expectation.
   *
   * @throws If nothing matching will throw.
   */
  getFirst(args: any[], property: string): Expectation {
    const expectation = this.findFirst(args, property);

    if (!expectation) {
      throw new UnexpectedCall(property);
    }

    this.remove(expectation);

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
}
