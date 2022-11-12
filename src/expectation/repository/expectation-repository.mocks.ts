/* eslint-disable class-methods-use-this */
import type { Property } from '../../proxy';
import type { Expectation } from '../expectation';
import type { ExpectationRepository } from './expectation-repository';
import type { ReturnValue } from './return-value';

export class OneIncomingExpectationRepository implements ExpectationRepository {
  public expectation: Expectation | undefined;

  add(expectation: Expectation) {
    this.expectation = expectation;
  }

  get(): ReturnValue {
    if (!this.expectation) {
      throw new Error();
    }

    return this.expectation.returnValue;
  }

  getAllProperties(): Property[] {
    return [];
  }

  getUnmet() {
    return this.expectation ? [this.expectation] : [];
  }

  clear(): void {
    this.expectation = undefined;
  }

  getCallStats = () => ({ expected: new Map(), unexpected: new Map() });

  apply(): never {
    throw new Error('not implemented');
  }
}
