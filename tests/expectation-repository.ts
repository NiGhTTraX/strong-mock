/* eslint-disable class-methods-use-this */
import { Expectation } from '../src/expectation';
import { ExpectationRepository } from '../src/expectation-repository';

export class OneIncomingExpectationRepository implements ExpectationRepository {
  public expectation: Expectation | undefined;

  add(expectation: Expectation) {
    this.expectation = expectation;
  }

  findAndConsume() {
    return this.expectation;
  }

  hasFor() {
    return !!this.expectation;
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

  findAndConsume() {
    return this.expectation;
  }

  hasFor() {
    return true;
  }

  getUnmet() {
    return [this.expectation];
  }
}

export class EmptyRepository implements ExpectationRepository {
  add() {}

  findAndConsume() {
    return undefined;
  }

  hasFor() {
    return false;
  }

  getUnmet() {
    return [];
  }
}
