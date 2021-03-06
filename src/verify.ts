import { UnexpectedCalls, UnmetExpectations } from './errors';
import { ExpectationRepository } from './expectation-repository';
import { getAllMocks, getMockState } from './map';
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
 * @throws Will throw if there are remaining expectations that were set
 * using `when` and that weren't met.
 *
 * @throws Will throw if any unexpected calls happened. Normally those
 * calls throw on their own, but the error might be caught by the code
 * being tested.
 *
 * @example
 * const fn = mock<() => number>();
 *
 * when(fn()).thenReturn(23);
 *
 * verify(fn); // throws
 */
export const verify = <T>(mock: Mock<T>): void => {
  const { repository } = getMockState(mock);

  verifyRepo(repository);
};

/**
 * Verify all existing mocks.
 *
 * @see verify
 */
export const verifyAll = (): void => {
  getAllMocks().forEach(([mock]) => {
    verify(mock);
  });
};
