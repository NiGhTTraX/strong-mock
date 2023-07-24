import { printValue } from '../print';
import type { TypeMatcher } from './matcher';
import { matches } from './matcher';

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
    toJSON: () => 'Matcher<number>',
    getDiff: (actual) => ({
      actual: `${printValue(actual)} (${typeof actual})`,
      expected: 'Matcher<number>',
    }),
  });
