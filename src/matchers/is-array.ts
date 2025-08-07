import { printValue } from '../print.js';
import { deepEquals } from './deep-equals.js';
import type { TypeMatcher } from './matcher.js';
import { isMatcher, matches } from './matcher.js';

/**
 * Match an array.
 *
 * Supports nested matchers.
 *
 * @param containing If given, the matched array has to contain ALL of these
 *   elements in ANY order. Use {@link It.deepEquals} or {@link It.matches} if
 *   you want more control.
 *
 * @example
 * const fn = mock<(arr: number[]) => number>();
 * when(() => fn(It.isArray())).thenReturn(1);
 * when(() => fn(It.isArray([2, 3]))).thenReturn(2);
 *
 * fn({ length: 1, 0: 42 }) // throws
 * fn([]) === 1
 * fn([3, 2, 1]) === 2
 *
 * @example
 * It.isArray([It.isString({ containing: 'foobar' })])
 */
export const isArray = <T extends unknown[]>(containing?: T): TypeMatcher<T> =>
  matches(
    (actual) => {
      if (!Array.isArray(actual)) {
        return false;
      }

      if (!containing) {
        return true;
      }

      return containing.every(
        (x) =>
          actual.find((y) => {
            if (isMatcher(x)) {
              return x.matches(y);
            }

            return deepEquals(x).matches(y);
          }) !== undefined,
      );
    },
    {
      toString: () =>
        containing
          ? `array([${containing.map((v) => printValue(v)).join(', ')}])`
          : 'array',
      getDiff: (actual) => {
        if (containing) {
          return {
            actual,
            expected: `Matcher<array>([${containing
              .map((value) => {
                if (isMatcher(value)) {
                  return value.toString();
                }

                return value;
              })
              .join(', ')}])`,
          };
        }

        return {
          actual: `${printValue(actual)} (${typeof actual})`,
          expected: 'Matcher<array>',
        };
      },
    },
  );
