import { afterEach, beforeEach } from 'vitest';
import { SM } from './old.js';

beforeEach(() => {
  SM.resetAll();
});

afterEach(() => {
  SM.verifyAll();
});
