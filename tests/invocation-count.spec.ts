import { describe, it } from 'tdd-buffet/suite/node';
import { PendingExpectation } from '../src/pending-expectation';
import { finishPendingExpectation } from '../src/when';
import { OneIncomingExpectationRepository } from './expectation-repository';
import { XXX } from './expectations';

describe('invocation count', () => {
  it('should set the min and max', () => {
    const expectation = new XXX('bar', undefined, undefined);

    const pendingExpectation = new PendingExpectation(() => expectation);
    pendingExpectation.start(new OneIncomingExpectationRepository());

    finishPendingExpectation(23, pendingExpectation).between(2, 8);

    expect(expectation.min).toEqual(2);
    expect(expectation.max).toEqual(8);
  });
});
