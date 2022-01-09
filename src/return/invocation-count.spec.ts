import { Expectation } from '../expectation/expectation';
import { createInvocationCount } from './invocation-count';
import { SM } from '../../tests/old';

describe('invocation count', () => {
  const expectation = SM.mock<Expectation>();

  it('between should set the min and max', () => {
    SM.when(expectation.setInvocationCount(2, 8)).thenReturn();

    const invocationCount = createInvocationCount(SM.instance(expectation));
    invocationCount.between(2, 8);

    SM.verify(expectation);
  });
});
