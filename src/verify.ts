import { UnexpectedCalls, UnmetExpectations } from './errors';
import { ExpectationRepository } from './expectation-repository';
import { getMockState } from './map';
import { Mock } from './mock';

export const verifyRepo = (repository: ExpectationRepository) => {
  const unmetExpectations = repository.getUnmet();

  if (unmetExpectations.length) {
    throw new UnmetExpectations(unmetExpectations);
  }

  if (repository.getCallStats().unexpected.size) {
    throw new UnexpectedCalls(
      repository.getCallStats().unexpected,
      repository.getUnmet()
    );
  }
};

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

  verifyRepo(repository);
};
