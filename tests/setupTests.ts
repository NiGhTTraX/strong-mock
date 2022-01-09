import { SM } from './old';

beforeEach(() => {
  SM.resetAll();
});

afterEach(() => {
  SM.verifyAll();
});
