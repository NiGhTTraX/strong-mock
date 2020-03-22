import { Expectation } from '../src/expectation';
import { ExpectationRepository } from '../src/expectation-repository';
import {
  ExpectationFactory,
  PendingExpectation
} from '../src/pending-expectation';

export class NeverMatchingExpectation implements Expectation {
  setInvocationCount = () => {};

  isUnmet = () => true;

  toJSON = () => 'never matching';

  args = undefined;

  property = 'bar';

  returnValue = undefined;

  matches = () => false;
}

export class OneUseAlwaysMatchingExpectation implements Expectation {
  setInvocationCount = () => {};

  isUnmet = () => true;

  toJSON = () => 'always matching';

  args = undefined;

  property = 'bar';

  returnValue = 42;

  matches = () => true;
}

export class NeverEndingAlwaysMatchingExpectation extends OneUseAlwaysMatchingExpectation {
  isUnmet = () => false;
}

export class SpyExpectation implements Expectation {
  max = -1;

  min = -1;

  setInvocationCount = (min: number, max: number) => {
    this.min = min;
    this.max = max;
  };

  isUnmet = () => true;

  toJSON = () => 'spy expectation';

  constructor(
    public property: PropertyKey,
    public args: any[] | undefined,
    public returnValue: any
  ) {}

  matches = () => false;
}

export class SingleUseExpectationWithReturn extends SpyExpectation {
  isUnmet = () => true;

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
  toJSON = () => 'spy pending expectation';

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
