import { Expectation } from '../src/expectation';

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
