import { MissingMock, UnmetExpectation } from './errors';
import { Mock, MockMap } from './mock';

export const verifyAll = <T>(mock: Mock<T>): void => {
  const repo = MockMap.get(mock);

  if (!repo) {
    throw new MissingMock();
  }

  if (repo.getUnmet().length) {
    throw new UnmetExpectation();
  }
};
