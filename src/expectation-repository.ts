import isEqual from 'lodash/isEqual';
import { UnexpectedCall } from './errors';
import { Expectation } from './expectations';

export class ExpectationRepository {
  private repo: Expectation[] = [];

  addExpectation(expectation: Expectation) {
    this.repo.push(expectation);
  }

  findMatchingExpectation(
    args: any[] | undefined,
    property: string
  ): Expectation | undefined {
    return this.repo.find(
      e => e.property === property && this.compareArgs(e, args)
    );
  }

  getMatchingExpectation(args: any[], property: string): Expectation {
    const expectationIndex = this.repo.findIndex(
      e => e.property === property && this.compareArgs(e, args)
    );

    if (expectationIndex === -1) {
      throw new UnexpectedCall(property);
    }

    const expectation = this.repo[expectationIndex];
    this.repo.splice(expectationIndex, 1);
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

  remove(expectation: Expectation) {
    this.repo = this.repo.filter(e => e !== expectation);
  }
}
