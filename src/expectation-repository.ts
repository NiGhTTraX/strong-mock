import { UnexpectedCall } from './errors';
import { Expectation } from './expectations';

export class ExpectationRepository {
  private repo: Expectation[] = [];

  addExpectation(expectation: Expectation) {
    this.repo.push(expectation);
  }

  getMatchingExpectation(args: any[]): Expectation {
    const expectationIndex = this.repo.findIndex(e =>
      e.args.every((a, i) => args[i] === a)
    );

    if (expectationIndex === -1) {
      throw new UnexpectedCall();
    }

    const expectation = this.repo[expectationIndex];
    this.repo.splice(expectationIndex, 1);
    return expectation;
  }

  get last(): Expectation {
    if (!this.repo.length) {
      throw new Error('This should never happen');
    }

    return this.repo[this.repo.length - 1];
  }
}
