import { UnmetExpectation } from './errors';
import { getRepoForMock, Mock } from './mock';

// TODO: add verifyAll
export const verify = <T>(mock: Mock<T>): void => {
  const repo = getRepoForMock(mock);

  const unmetExpectations = repo.getUnmet();

  if (unmetExpectations.length) {
    throw new UnmetExpectation(unmetExpectations);
  }
};
