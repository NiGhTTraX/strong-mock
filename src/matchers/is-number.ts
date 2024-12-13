import { printValue } from '../print.js';
import type { TypeMatcher } from './matcher.js';
import { matches } from './matcher.js';

/**
 * Match any number.
 *
 * @example
 * const fn = mock<(x: number) => number>();
 * when(() => fn(It.isNumber())).returns(42);
 *
 * fn(20.5) === 42
 * fn(NaN) // throws
 */
export const isNumber = (): TypeMatcher<number> =>
  matches((actual) => typeof actual === 'number' && !Number.isNaN(actual), {
    toString: () => 'Matcher<number>',
    getDiff: (actual) => ({
      actual: `${printValue(actual)} (${typeof actual})`,
      expected: 'Matcher<number>',
    }),
  });
