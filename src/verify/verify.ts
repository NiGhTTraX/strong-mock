import { UnexpectedCalls, UnmetExpectations } from '../errors/verify';
import type { ExpectationRepository } from '../expectation/repository/expectation-repository';
import { getAllMocks, getMockState } from '../mock/map';
import type { Mock } from '../mock/mock';

export const verifyRepo = (repository: ExpectationRepository) => {
  const unmetExpectations = repository.getUnmet();

  if (unmetExpectations.length) {
    throw new UnmetExpectations(unmetExpectations);
  }

  const callStats = repository.getCallStats();

  if (callStats.unexpected.size) {
    throw new UnexpectedCalls(callStats.unexpected, unmetExpectations);
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
 * when(() => fn()).thenReturn(23);
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
