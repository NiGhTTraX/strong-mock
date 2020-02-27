import { ExpectationRepository } from '../src/expectation-repository';
import { Expectation } from '../src/expectations';

export class OneExpectationRepository implements ExpectationRepository {
  public expectation: Expectation | undefined;

  add(expectation: Expectation): void {
    this.expectation = expectation;
  }

  find(): Expectation | undefined {
    return this.expectation;
  }
}
