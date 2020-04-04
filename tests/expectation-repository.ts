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

  hasKey() {
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

  get(): ReturnValue {
    return { returnValue: this.expectation.returnValue };
  }

  hasKey() {
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

  get(): undefined {
    return undefined;
  }

  hasKey() {
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

  public getCalledWith: [PropertyKey, any[] | undefined] | undefined;

  public hasForCalledWith: PropertyKey | undefined;

  private getCounter = 0;

  constructor(
    private hasForReturn: boolean,
    private getReturns: (Expectation | undefined)[]
  ) {}

  add(expectation: Expectation) {
    this.addCalledWith = expectation;
  }

  clear() {}

  get(property: PropertyKey, args: any[] | undefined): ReturnValue | undefined {
    this.getCalledWith = [property, args];

    const expectation = this.getReturns[this.getCounter];
    this.getCounter++;

    return (
      expectation && {
        returnValue: expectation.returnValue,
      }
    );
  }

  getUnmet() {
    return [];
  }

  hasKey(property: PropertyKey) {
    this.hasForCalledWith = property;
    return this.hasForReturn;
  }
}
