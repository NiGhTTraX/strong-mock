import { printValue } from '../print.js';
import type { TypeMatcher } from './matcher.js';
import { matches } from './matcher.js';

/**
 * Compare values using `Object.is`.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 *
 * @see It.deepEquals A matcher that uses deep equality.
 */
export const is = <T = unknown>(expected: T): TypeMatcher<T> =>
  matches((actual) => Object.is(actual, expected), {
    toString: () => `${printValue(expected)}`,
    getDiff: (actual) => ({ actual, expected }),
  });
