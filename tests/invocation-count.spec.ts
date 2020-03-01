import { describe, it } from 'tdd-buffet/suite/node';
import { returnInvocationCount } from '../src/when';
import { SpyExpectation } from './expectations';

describe('invocation count', () => {
  it('should set the min and max', () => {
    const expectation = new SpyExpectation('bar', undefined, undefined);

    returnInvocationCount(expectation).between(2, 8);

    expect(expectation.min).toEqual(2);
    expect(expectation.max).toEqual(8);
  });
});
