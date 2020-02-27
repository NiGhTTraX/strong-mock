import { UnmetExpectation } from './errors';
import { getRepoForStub, Mock } from './mock';

export const verifyAll = <T>(mock: Mock<T>): void => {
  const repo = getRepoForStub(mock);

  if (repo.getUnmet().length) {
    throw new UnmetExpectation();
  }
};
