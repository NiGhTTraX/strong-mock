import type { Property } from '../proxy';
import type { Expectation } from './expectation';
import type { ReturnValue } from './repository/return-value';

export class OneUseAlwaysMatchingExpectation implements Expectation {
  setInvocationCount = () => {};

  toString = () => 'always matching';

  args = undefined;

  min = 1;

  max = 1;

  property = 'bar';

  returnValue = { value: 42 };

  matches = () => true;
}

export class MatchingPropertyExpectation implements Expectation {
  constructor(
    public property: Property,
    public returnValue: ReturnValue,
  ) {}

  args = undefined;

  max = 1;

  min = 1;

  matches = (args: unknown[] | undefined) => args === undefined;

  setInvocationCount(min: number, max: number) {
    this.min = min;
    this.max = max;
  }

  toString = () => 'matching property';
}

export class MatchingCallExpectation implements Expectation {
  constructor(
    public property: Property,
    public returnValue: ReturnValue,
  ) {}

  args = [];

  max = 1;

  min = 1;

  setInvocationCount(min: number, max: number) {
    this.min = min;
    this.max = max;
  }

  matches = (args: unknown[] | undefined): boolean => !!args;

  toString = () => 'matching call';
}

export class NotMatchingExpectation extends MatchingCallExpectation {
  matches = () => false;

  toString = () => 'not matching';
}
