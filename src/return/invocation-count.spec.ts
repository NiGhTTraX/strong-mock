import { describe, it } from 'vitest';
import { SM } from '../../tests/old';
import type { Expectation } from '../expectation/expectation';
import { createInvocationCount } from './invocation-count';

describe('invocation count', () => {
  const expectation = SM.mock<Expectation>();

  it('between should set the min and max', () => {
    SM.when(() => expectation.setInvocationCount(2, 8)).thenReturn();

    const invocationCount = createInvocationCount(expectation);
    invocationCount.between(2, 8);

    SM.verify(expectation);
  });
});
