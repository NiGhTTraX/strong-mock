import { printValue } from '../print';
import type { TypeMatcher } from './matcher';
import { matches } from './matcher';

/**
 * Compare values using `Object.is`.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 *
 * @see It.deepEquals A matcher that uses deep equality.
 */
export const is = <T = unknown>(expected: T): TypeMatcher<T> =>
  matches((actual) => Object.is(actual, expected), {
    toJSON: () => `${printValue(expected)}`,
    getDiff: (actual) => ({ actual, expected }),
  });
