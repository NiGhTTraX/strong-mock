/* eslint-disable padding-line-between-statements */
/* istanbul ignore file */

export { mock } from './mock/mock';
export { when } from './when/when';
export { reset, resetAll } from './verify/reset';
export { verify, verifyAll } from './verify/verify';
export { It } from './matchers/it';
export { setDefaults } from './mock/defaults';

export type { Matcher } from './matchers/matcher';
export type { MockOptions } from './mock/options';
export { UnexpectedProperty } from './mock/options';
