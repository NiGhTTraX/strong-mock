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

  hasFor() {
    return !!this.expectation;
  }

  getUnmet() {
    return this.expectation ? [this.expectation] : [];
  }

  clear(): void {
    this.expectation = undefined;
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

  hasFor() {
    return true;
  }

  getUnmet() {
    return [this.expectation];
  }

  clear(): void {
    throw new Error('not supported');
  }
}

export class EmptyRepository implements ExpectationRepository {
  add() {}

  find() {
    return undefined;
  }

  hasFor() {
    return false;
  }

  getUnmet() {
    return [];
  }

  clear(): void {}
}

// TODO: use this to remove the other mocks
export class SpyRepository implements ExpectationRepository {
  public addCalledWith: Expectation | undefined;

  public findAndConsumeCalledWith: [PropertyKey, any[] | undefined] | undefined;

  public hasForCalledWith: PropertyKey | undefined;

  private findAndConsumeCounter = 0;

  constructor(
    private hasForReturn: boolean,
    private findAndConsumeReturn: (Expectation | undefined)[]
  ) {}

  add(expectation: Expectation) {
    this.addCalledWith = expectation;
  }

  clear() {}

  find(property: PropertyKey, args: any[] | undefined) {
    this.findAndConsumeCalledWith = [property, args];

    return this.findAndConsumeReturn[this.findAndConsumeCounter++];
  }

  getUnmet() {
    return [];
  }

  hasFor(property: PropertyKey) {
    this.hasForCalledWith = property;
    return this.hasForReturn;
  }
}
