/* eslint-disable class-methods-use-this */
import { Expectation, ReturnValue } from '../expectation';
import { ExpectationRepository } from './expectation-repository';

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
