/* istanbul ignore file */
import { instance } from './instance/instance';
import { It } from './expectation/matcher';
import { mock } from './mock/mock';
import { reset, resetAll } from './verify/reset';
import { verify, verifyAll } from './verify/verify';
import { when } from './when/when';

export { mock, when, instance, verify, verifyAll, reset, resetAll, It };
