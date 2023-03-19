import type { Property } from '../proxy';
import type {
  ExpectationFactory,
  PendingExpectation,
} from '../when/pending-expectation';
import type { Expectation } from './expectation';
import type { Matcher } from './matcher';
import type { ReturnValue } from './repository/return-value';

export class OneUseAlwaysMatchingExpectation implements Expectation {
  // eslint-disable-next-line no-empty-function,@typescript-eslint/no-empty-function
  setInvocationCount = () => {};

  toJSON = () => 'always matching';

  args = undefined;

  min = 1;

  max = 1;

  property = 'bar';

  returnValue = { value: 42 };

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
    public property: Property,
    public args: Matcher[] | undefined,
    public returnValue: ReturnValue
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

  public argsCalledWith: unknown[] | undefined;

  public finishCalledWith: ReturnValue | undefined;

  public propertyCalledWith: Property | undefined;

  setProperty(value: Property) {
    this.propertyCalledWith = value;
  }

  setArgs(args: unknown[] | undefined) {
    this.argsCalledWith = args;
  }

  finish(returnValue: ReturnValue) {
    this.finishCalledWith = returnValue;

    return new OneUseAlwaysMatchingExpectation();
  }
}

export class MatchingPropertyExpectation implements Expectation {
  constructor(public property: Property, public returnValue: ReturnValue) {}

  args = undefined;

  max = 1;

  min = 1;

  matches = (args: unknown[] | undefined) => args === undefined;

  setInvocationCount(min: number, max: number) {
    this.min = min;
    this.max = max;
  }

  toJSON = () => 'matching property';
}

export class MatchingCallExpectation implements Expectation {
  constructor(public property: Property, public returnValue: ReturnValue) {}

  args = [];

  max = 1;

  min = 1;

  setInvocationCount(min: number, max: number) {
    this.min = min;
    this.max = max;
  }

  matches = (args: unknown[] | undefined) => !!args;

  toJSON = () => 'matching call';
}

export class NotMatchingExpectation extends MatchingCallExpectation {
  matches = () => false;

  toJSON = () => 'not matching';
}
