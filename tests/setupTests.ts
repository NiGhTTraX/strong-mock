import { beforeEach, afterEach } from 'tdd-buffet/suite/node';
import { SM } from './old';

beforeEach(() => {
  SM.resetAll();
});

afterEach(() => {
  SM.verifyAll();
});
