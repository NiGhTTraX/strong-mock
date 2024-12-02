import { afterEach, beforeEach } from 'vitest';
import { SM } from './old';

beforeEach(() => {
  SM.resetAll();
});

afterEach(() => {
  SM.verifyAll();
});
