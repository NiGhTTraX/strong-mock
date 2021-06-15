/* eslint-disable class-methods-use-this */
import { Expectation, ReturnValue } from '../src/expectation/expectation';
import { ExpectationRepository } from '../src/repository/expectation-repository';

export class OneIncomingExpectationRepository implements ExpectationRepository {
  public expectation: Expectation | undefined;

  add(expectation: Expectation) {
    this.expectation = expectation;
  }

  get(): ReturnValue | undefined {
    return this.expectation?.returnValue;
  }

  getUnmet() {
    return this.expectation ? [this.expectation] : [];
  }

  clear(): void {
    this.expectation = undefined;
  }

  getCallStats = () => ({ expected: new Map(), unexpected: new Map() });
}
