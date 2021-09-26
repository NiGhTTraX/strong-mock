/* istanbul ignore file */
export { mock } from './mock/mock';
export { when } from './when/when';
export { instance } from './instance/instance';
export { reset, resetAll } from './verify/reset';
export { verify, verifyAll } from './verify/verify';
export { It } from './expectation/it';
export { setDefaults } from './mock/defaults';

export type { Matcher } from './expectation/matcher';
export type { StrongMockDefaults } from './mock/defaults';
