import type { TypeMatcher } from './matcher';
import { matches } from './matcher';

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
    toJSON: () => 'anything',
    getDiff: (actual) => ({ actual, expected: actual }),
  });
