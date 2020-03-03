import { UnmetExpectations } from './errors';
import { getRepoForMock, Mock } from './mock';

/**
 * Verify that all expectations on the given mock have been met.
 *
 * @example
 * const fn = mock<() => number>();
 *
 * when(fn()).thenReturn(23);
 *
 * verify(fn); // throws
 */
// TODO: add verifyAll
export const verify = <T>(mock: Mock<T>): void => {
  const repo = getRepoForMock(mock);

  const unmetExpectations = repo.getUnmet();

  if (unmetExpectations.length) {
    throw new UnmetExpectations(unmetExpectations);
  }
};
