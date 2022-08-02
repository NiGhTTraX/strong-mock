import { getActiveMock, getMockState } from '../mock/map';
import { setRecording } from '../mock/mock';
import { createReturns, Stub } from '../return/returns';

/**
 * Set an expectation on a mock.
 *
 * The expectation must be finished by setting a return value, even if the value
 * is `undefined`.
 *
 * If a call happens that was not expected then the mock will throw an error.
 * By default, the call is expected to only be made once. Use the invocation
 * count helpers to expect a call multiple times.
 *
 * @param expectation A callback to set the expectation on your mock. The
 *   callback must return the value from the mock to properly infer types.
 *
 * @example
 * const fn = mock<() => void>();
 * when(() => fn()).thenReturn(undefined);
 *
 * @example
 * const fn = mock<() => number>();
 * when(() => fn()).thenReturn(42).atMost(3);
 *
 * @example
 * const fn = mock<(x: number) => Promise<number>();
 * when(() => fn(23)).thenResolve(42);
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
export const when = <R>(expectation: () => R): Stub<R> => {
  setRecording(true);
  expectation();
  setRecording(false);

  const mockState = getMockState(getActiveMock());

  return createReturns<R>(
    mockState.pendingExpectation,
    mockState.options.concreteMatcher
  );
};
