import { Expectation } from '../src/expectation';
import { ExpectationRepository } from '../src/expectation-repository';
import {
  ExpectationFactory,
  PendingExpectation,
} from '../src/pending-expectation';

export class NeverMatchingExpectation implements Expectation {
  setInvocationCount = () => {};

  toJSON = () => 'never matching';

  min = 1;

  max = 1;

  args = undefined;

  property = 'bar';

  returnValue = undefined;

  matches = () => false;
}

export class OneUseAlwaysMatchingExpectation implements Expectation {
  setInvocationCount = () => {};

  toJSON = () => 'always matching';

  args = undefined;

  min = 1;

  max = 1;

  property = 'bar';

  returnValue = 42;

  matches = () => true;
}

export class SpyExpectation implements Expectation {
  max = -1;

  min = -1;

  setInvocationCount = (min: number, max: number) => {
    this.min = min;
    this.max = max;
  };

  toJSON = () => 'spy expectation';

  constructor(
    public property: PropertyKey,
    public args: any[] | undefined,
    public returnValue: any
  ) {}

  matches = () => false;
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

export class MatchingPropertyExpectation implements Expectation {
  constructor(public property: PropertyKey, public returnValue: any) {}

  args = undefined;

  max = 1;

  min = 1;

  matches = (args: any[] | undefined) => args === undefined;

  setInvocationCount(min: number, max: number) {
    this.min = min;
    this.max = max;
  }

  toJSON = () => 'matching property';
}

export class MatchingCallExpectation implements Expectation {
  constructor(public property: PropertyKey, public returnValue: any) {}

  args = [];

  max = 1;

  min = 1;

  setInvocationCount(min: number, max: number) {
    this.min = min;
    this.max = max;
  }

  matches = (args: any[] | undefined) => !!args;

  toJSON = () => 'matching call';
}

export class NotMatchingExpectation extends MatchingCallExpectation {
  matches = () => false;

  toJSON = () => 'not matching';
}
