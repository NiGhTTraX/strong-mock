import { UnmetExpectation } from './errors';
import { getRepoForMock, Mock } from './mock';

export const verifyAll = <T>(mock: Mock<T>): void => {
  const repo = getRepoForMock(mock);

  if (repo.getUnmet().length) {
    throw new UnmetExpectation();
  }
};
