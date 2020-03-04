import { getMockState } from './map';
import { Mock } from './mock';

/**
 * Remove any remaining expectations on the given mock.
 *
 * @example
 * const fn = mock<() => number>();
 *
 * when(fn()).thenReturn(23);
 *
 * reset(fn);
 *
 * instance(fn)(); // throws
 * @param mock
 */
// TODO: add resetAll
export const reset = (mock: Mock<any>): void => {
  getMockState(mock).repository.clear();
};
