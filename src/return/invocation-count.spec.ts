import { describe, it } from 'vitest';
import { SM } from '../../tests/old.js';
import type { Expectation } from '../expectation/expectation.js';
import { createInvocationCount } from './invocation-count.js';

describe('invocation count', () => {
  const expectation = SM.mock<Expectation>();

  it('between should set the min and max', () => {
    SM.when(() => expectation.setInvocationCount(2, 8)).thenReturn();

    const invocationCount = createInvocationCount(expectation);
    invocationCount.between(2, 8);

    SM.verify(expectation);
  });
});
