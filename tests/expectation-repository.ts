/* eslint-disable class-methods-use-this */
import { Expectation } from '../src/expectation';
import { ExpectationRepository } from '../src/expectation-repository';

export class OneIncomingExpectationRepository implements ExpectationRepository {
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

export class OneExistingExpectationRepository implements ExpectationRepository {
  constructor(public expectation: Expectation) {}

  add() {
    throw new Error('not supported');
  }

  find() {
    return this.expectation;
  }

  getUnmet() {
    return [this.expectation];
  }
}

export class EmptyRepository implements ExpectationRepository {
  add() {}

  find() {
    return undefined;
  }

  getUnmet() {
    return [];
  }
}
