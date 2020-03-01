import { SINGLETON_PENDING_EXPECTATION } from './pending-expectation';
import { createReturns, Stub } from './returns';

// eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
export const when = <R>(expectation: R): Stub<R> => {
  return createReturns<R>(SINGLETON_PENDING_EXPECTATION);
};
