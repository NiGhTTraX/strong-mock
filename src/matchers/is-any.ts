import type { TypeMatcher } from './matcher.js';
import { matches } from './matcher.js';

/**
 * Match any value, including `undefined` and `null`.
 *
 * @example
 * const fn = mock<(x: number, y: string) => number>();
 * when(() => fn(It.isAny(), It.isAny())).thenReturn(1);
 *
 * fn(23, 'foobar') === 1
 */
export const isAny = (): TypeMatcher<any> =>
  matches(() => true, {
    toString: () => 'Matcher<any>',
  });
