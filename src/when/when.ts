import { getActiveMock, getMockState } from '../mock/map';
import { Mode, setMode } from '../mock/mode';
import type { NonPromiseStub, PromiseStub } from '../return/returns';
import { createReturns } from '../return/returns';

interface When {
  <R>(expectation: () => Promise<R>): PromiseStub<R, Promise<R>>;
  <R>(expectation: () => R): NonPromiseStub<R>;
}

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
export const when: When = <R>(expectation: () => R) => {
  setMode(Mode.EXPECT);
  expectation();
  setMode(Mode.CALL);

  const { builder, repository } = getMockState(getActiveMock());

  return createReturns(builder, repository);
};
