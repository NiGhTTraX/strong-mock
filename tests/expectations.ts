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

  returnValue = undefined;

  matches = () => true;
}

export class NeverEndingAlwaysMatchingExpectation extends OneUseAlwaysMatchingExpectation {
  min = 0;

  max = Infinity;
}

export class XXX implements Expectation {
  constructor(
    public property: PropertyKey,
    public args: any[] | undefined,
    public returnValue: any
  ) {}

  max = 1;

  min = 1;

  matches = () => false;
}
