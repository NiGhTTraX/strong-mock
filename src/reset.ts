import { getRepoForMock, Mock } from './mock';

// TODO: reset all mocks
export const reset = (mock: Mock<any>): void => {
  getRepoForMock(mock).clear();
};
