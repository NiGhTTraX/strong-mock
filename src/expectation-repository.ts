import { Expectation } from './expectations';

export class ExpectationRepository {
  private repo: Expectation[] = [];

  addExpectation(expectation: Expectation) {
    this.repo.push(expectation);
  }

  getMatchingExpectation(): Expectation | undefined {
    const expectation = this.repo[0];
    this.repo.splice(0, 1);
    return expectation;
  }
}
