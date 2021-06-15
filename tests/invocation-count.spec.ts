import { describe, it } from 'tdd-buffet/suite/node';
import { Expectation } from '../src/expectation/expectation';
import { createInvocationCount } from '../src/return/invocation-count';
import { SM } from './old';

describe('invocation count', () => {
  const expectation = SM.mock<Expectation>();

  it('between should set the min and max', () => {
    SM.when(expectation.setInvocationCount(2, 8)).thenReturn();

    const invocationCount = createInvocationCount(SM.instance(expectation));
    invocationCount.between(2, 8);

    SM.verify(expectation);
  });
});
