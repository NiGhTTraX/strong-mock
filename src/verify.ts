import { UnmetExpectations } from './errors';
import { getMockState } from './map';
import { Mock } from './mock';

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
  const { repository } = getMockState(mock);

  const unmetExpectations = repository.getUnmet();

  if (unmetExpectations.length) {
    throw new UnmetExpectations(unmetExpectations);
  }
};
