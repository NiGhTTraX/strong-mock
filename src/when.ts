import { getActiveMock, getMockState } from './mock';
import { createReturns, Stub } from './returns';

/**
 * Set an expectation on a mock.
 *
 * The expectation must be finished by setting a return value. By default, the
 * call is expected to only be made once. Use the invocation count helpers to
 * expect a call multiple times.
 *
 * If a call happens that was not expected then the mock will throw an error.
 *
 * @example
 * when(mock(1, 2, 3)).thenReturn(42);
 *
 * @example
 * const foo = mock<() => number>();
 *
 * when(foo()).thenReturn('baz'); // type error, expected number
 *
 * @param expectation The type of this will be used in the calls that set
 *   a return value.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
export const when = <R>(expectation: R): Stub<R> => {
  return createReturns<R>(getMockState(getActiveMock()).pendingExpectation);
};
