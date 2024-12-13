import type { Property } from '../../proxy.js';
import type { Expectation } from '../expectation.js';
import type { ExpectationRepository } from './expectation-repository.js';
import type { ReturnValue } from './return-value.js';

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
