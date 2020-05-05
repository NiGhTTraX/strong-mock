/* eslint-disable class-methods-use-this */
import { Expectation } from '../src/expectation';
import {
  ExpectationRepository,
  ReturnValue,
} from '../src/expectation-repository';

export class OneIncomingExpectationRepository implements ExpectationRepository {
  public expectation: Expectation | undefined;

  add(expectation: Expectation) {
    this.expectation = expectation;
  }

  get(): ReturnValue | undefined {
    return this.expectation && { returnValue: this.expectation.returnValue };
  }

  getUnmet() {
    return this.expectation ? [this.expectation] : [];
  }

  clear(): void {
    this.expectation = undefined;
  }

  getCallStats = () => ({ expected: new Map(), unexpected: new Map() });
}

export class OneExistingExpectationRepository implements ExpectationRepository {
  constructor(public expectation: Expectation) {}

  add() {
    throw new Error('not supported');
  }

  get(): ReturnValue {
    return { returnValue: this.expectation.returnValue };
  }

  getUnmet() {
    return [this.expectation];
  }

  clear(): void {
    throw new Error('not supported');
  }

  getCallStats = () => ({ expected: new Map(), unexpected: new Map() });
}

export class EmptyRepository implements ExpectationRepository {
  add() {}

  get = () => undefined;

  getUnmet() {
    return [];
  }

  clear(): void {}

  getCallStats = () => ({ expected: new Map(), unexpected: new Map() });
}

// TODO: use this to remove the other mocks
export class SpyRepository implements ExpectationRepository {
  public addCalledWith: Expectation | undefined;

  public getCalledWith: [PropertyKey] | undefined;

  private getCounter = 0;

  constructor(private hasForReturn: boolean, private getReturns: any[]) {}

  add(expectation: Expectation) {
    this.addCalledWith = expectation;
  }

  clear() {}

  get(property: PropertyKey) {
    this.getCalledWith = [property];

    const returnValue = this.getReturns[this.getCounter];
    this.getCounter++;

    return returnValue;
  }

  getUnmet() {
    return [];
  }

  getCallStats = () => ({ expected: new Map(), unexpected: new Map() });
}
