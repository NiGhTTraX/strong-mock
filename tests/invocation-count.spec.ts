import { describe, it } from 'tdd-buffet/suite/node';
import { expect } from 'tdd-buffet/expect/jest';
import { createInvocationCount } from '../src/invocation-count';
import { SpyExpectation } from './expectations';

describe('invocation count', () => {
  it('between should set the min and max', () => {
    const expectation = new SpyExpectation('bar', undefined, undefined);

    const invocationCount = createInvocationCount(expectation);
    invocationCount.between(2, 8);

    expect(expectation.min).toEqual(2);
    expect(expectation.max).toEqual(8);
  });
});
