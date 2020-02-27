import { MissingMock, UnmetExpectation } from './errors';
import { Mock, MOCK_MAP } from './mock';

export const verifyAll = <T>(mock: Mock<T>): void => {
  const repo = MOCK_MAP.get(mock);

  if (!repo) {
    throw new MissingMock();
  }

  if (repo.getUnmet().length) {
    throw new UnmetExpectation();
  }
};
