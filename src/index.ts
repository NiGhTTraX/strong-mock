/* c8 ignore file */

export { mock } from './mock/mock.js';

export { when } from './when/when.js';

export { reset, resetAll } from './verify/reset.js';

export { verify, verifyAll } from './verify/verify.js';

export { setDefaults } from './mock/defaults.js';

import * as It from './matchers/it.js';

/**
 * Contains matchers that can be used to ignore arguments in an
 * expectation or to match complex arguments.
 */
export { It };

export type { Matcher, MatcherOptions } from './matchers/matcher.js';

export type { MockOptions } from './mock/options.js';

export { UnexpectedProperty } from './mock/options.js';
