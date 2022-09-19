import { getAllMocks, getMockState } from '../mock/map';
import type { Mock } from '../mock/mock';

/**
 * Remove any remaining expectations on the given mock.
 *
 * @example
 * const fn = mock<() => number>();
 *
 * when(() => fn()).thenReturn(23);
 *
 * reset(fn);
 *
 * fn(); // throws
 */
export const reset = (mock: Mock<any>): void => {
  getMockState(mock).repository.clear();
};

/**
 * Reset all existing mocks.
 *
 * @see reset
 */
export const resetAll = (): void => {
  getAllMocks().forEach(([mock]) => {
    reset(mock);
  });
};
