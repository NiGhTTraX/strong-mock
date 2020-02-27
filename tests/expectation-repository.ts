import { Expectation } from '../src/expectation';
import { ExpectationRepository } from '../src/expectation-repository';

export class OneExpectationRepository implements ExpectationRepository {
  public expectation: Expectation | undefined;

  add(expectation: Expectation) {
    this.expectation = expectation;
  }

  find() {
    return this.expectation;
  }

  getUnmet() {
    return this.expectation ? [this.expectation] : [];
  }
}
