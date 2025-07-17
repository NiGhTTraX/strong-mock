/* istanbul ignore file */

export { mock } from './mock/mock';

export { when } from './when/when';

export { reset, resetAll } from './verify/reset';

export { verify, verifyAll } from './verify/verify';

export { setDefaults } from './mock/defaults';

import * as It from './matchers/it';

/**
 * Contains matchers that can be used to ignore arguments in an
 * expectation or to match complex arguments.
 */
export { It };

export type { Matcher, MatcherOptions } from './matchers/matcher';

export type { MockOptions } from './mock/options';

export { UnexpectedProperty } from './mock/options';
