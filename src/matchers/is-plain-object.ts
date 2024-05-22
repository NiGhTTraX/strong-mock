import { isObjectLike, isPlainObject as isPlainObjectLodash } from 'lodash';
import { printValue } from '../print';
import type { Property } from '../proxy';
import type { TypeMatcher } from './matcher';
import { matches } from './matcher';

type ObjectType = Record<Property, unknown>;

/**
 * Matches any plain object e.g. object literals or objects created with `Object.create()`.
 *
 * Classes, arrays, maps, sets etc. are not considered plain objects.
 * You can use {@link containsObject} or {@link matches} to match those.
 *
 * @example
 * const fn = mock<({ foo: string }) => number>();
 * when(() => fn(It.isPlainObject())).thenReturn(42);
 *
 * fn({ foo: 'bar' }) // returns 42
 */
export const isPlainObject = <T extends ObjectType>(): TypeMatcher<T> =>
  matches((actual) => isPlainObjectLodash(actual), {
    toString: () => 'Matcher<object>',
    getDiff: (actual) => {
      const type = isObjectLike(actual) ? 'object-like' : typeof actual;

      return {
        actual: `${printValue(actual)} (${type})`,
        expected: 'Matcher<object>',
      };
    },
  });
