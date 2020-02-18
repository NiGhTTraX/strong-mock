import { MethodExpectation } from './expectations';

export class ExpectationRepository {
  private repo: MethodExpectation[] = [];

  addExpectation(expectation: MethodExpectation) {
    this.repo.push(expectation);
  }

  getMatchingExpectation(): MethodExpectation | undefined {
    const methodExpectation = this.repo[0];
    this.repo.splice(0, 1);
    return methodExpectation;
  }
}
