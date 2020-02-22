import { UnexpectedCall } from './errors';
import { Expectation } from './expectations';

export class ExpectationRepository {
  private repo: Expectation[] = [];

  addExpectation(expectation: Expectation) {
    this.repo.push(expectation);
  }

  getMatchingExpectation(args: any[], property: string): Expectation {
    const expectationIndex = this.repo.findIndex(
      e => e.property === property && e.args.every((a, i) => args[i] === a)
    );

    if (expectationIndex === -1) {
      throw new UnexpectedCall();
    }

    const expectation = this.repo[expectationIndex];
    this.repo.splice(expectationIndex, 1);
    return expectation;
  }
}
