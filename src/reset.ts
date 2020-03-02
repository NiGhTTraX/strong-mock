import { getRepoForMock, Mock } from './mock';

// TODO: add resetAll
export const reset = (mock: Mock<any>): void => {
  getRepoForMock(mock).clear();
};
