import { UnexpectedCalls, UnmetExpectations } from './errors';
import { ExpectationRepository2 } from './expectation-repository';
import { getMockState, getMockState2 } from './map';
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

export const verify3 = (repository: ExpectationRepository2) => {
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

export const verify2 = <T>(mock: Mock<T>): void => {
  const { repository } = getMockState2(mock);

  verify3(repository);
};
