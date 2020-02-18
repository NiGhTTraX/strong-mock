import { Expectation } from './expectations';

export class ExpectationRepository {
  private repo: Expectation[] = [];

  addExpectation(expectation: Expectation) {
    this.repo.push(expectation);
  }

  getMatchingExpectation(args: any[]): Expectation | undefined {
    const expectationIndex = this.repo.findIndex(e =>
      e.args.every((a, i) => args[i] === a)
    );
    const expectation = this.repo[expectationIndex];
    this.repo.splice(expectationIndex, 1);
    return expectation;
  }

  get last(): Expectation {
    return this.repo[this.repo.length - 1];
  }
}
