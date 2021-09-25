/* istanbul ignore file */
import { instance } from './instance/instance';
import { It, Matcher } from './expectation/matcher';
import { setDefaults, StrongMockDefaults } from './mock/defaults';
import { mock } from './mock/mock';
import { reset, resetAll } from './verify/reset';
import { verify, verifyAll } from './verify/verify';
import { when } from './when/when';

export {
  mock,
  when,
  instance,
  verify,
  verifyAll,
  reset,
  resetAll,
  It,
  setDefaults,
};

export type { StrongMockDefaults, Matcher };
