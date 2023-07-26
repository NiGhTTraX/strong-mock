import type { TypeMatcher } from './matcher';
import { matches } from './matcher';

/**
 * Match any string.
 *
 * @param matching An optional string or RegExp to match the string against.
 *   If it's a string, a case-sensitive search will be performed.
 *
 * @example
 * const fn = mock<(x: string, y: string) => number>();
 * when(() => fn(It.isString(), It.isString('bar'))).returns(42);
 *
 * fn('foo', 'baz') // throws
 * fn('foo', 'bar') === 42
 */
export const isString = (matching?: string | RegExp): TypeMatcher<string> =>
  matches(
    (actual) => {
      if (typeof actual !== 'string') {
        return false;
      }

      if (!matching) {
        return true;
      }

      if (typeof matching === 'string') {
        return actual.indexOf(matching) !== -1;
      }

      return matching.test(actual);
    },
    {
      toString: () => {
        if (matching) {
          return `Matcher<string>(${matching})`;
        }

        return 'Matcher<string>';
      },
      getDiff: (actual) => {
        if (matching) {
          return {
            expected: `Matcher<string>(${matching})`,
            actual,
          };
        }

        return {
          expected: 'Matcher<string>',
          actual: `${actual} (${typeof actual})`,
        };
      },
    }
  );
