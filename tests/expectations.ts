import { Expectation } from '../src/expectation';
import { ExpectationRepository } from '../src/expectation-repository';
import {
  ExpectationFactory,
  PendingExpectation
} from '../src/pending-expectation';

export class NeverMatchingExpectation implements Expectation {
  args = undefined;

  max = 1;

  min = 1;

  property = 'bar';

  returnValue = undefined;

  matches = () => false;
}

export class OneUseAlwaysMatchingExpectation implements Expectation {
  args = undefined;

  max = 1;

  min = 1;

  property = 'bar';

  returnValue = 42;

  matches = () => true;
}

export class NeverEndingAlwaysMatchingExpectation extends OneUseAlwaysMatchingExpectation {
  min = 0;

  max = Infinity;
}

export class SpyExpectation implements Expectation {
  constructor(
    public property: PropertyKey,
    public args: any[] | undefined,
    public returnValue: any
  ) {}

  max = 1;

  min = 1;

  matches = () => false;
}

export class SingleUseExpectationWithReturn extends SpyExpectation {
  constructor(public returnValue: any) {
    super(':irrelevant:', undefined, returnValue);
  }

  min = 1;

  max = 1;

  matches = () => true;
}

export const spyExpectationFactory: ExpectationFactory = (
  property,
  args,
  returnValue
) => new SpyExpectation(property, args, returnValue);

export class SpyPendingExpectation implements PendingExpectation {
  public argsCalledWith: any[] | undefined;

  public clearCalled = false;

  public finishCalledWith: any;

  public propertyCalledWith: PropertyKey | undefined;

  public startCalledWith: ExpectationRepository | undefined;

  set args(args: any[] | undefined) {
    this.argsCalledWith = args;
  }

  clear() {
    this.clearCalled = true;
  }

  finish(returnValue: any) {
    this.finishCalledWith = returnValue;
    return new OneUseAlwaysMatchingExpectation();
  }

  set property(value: PropertyKey) {
    this.propertyCalledWith = value;
  }

  start(repo: ExpectationRepository) {
    this.startCalledWith = repo;
  }
}
