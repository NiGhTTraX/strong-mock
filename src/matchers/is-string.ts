import type { TypeMatcher } from './matcher';
import { matches } from './matcher';

/**
 * Match a string, potentially by a pattern.
 *
 * @param matching The string has to match this RegExp.
 * @param containing The string has to contain this substring.
 *
 * @example
 * const fn = mock<(x: string, y: string) => number>();
 * when(() => fn(It.isString(), It.isString({ containing: 'bar' }))).returns(42);
 *
 * fn('foo', 'baz') // throws
 * fn('foo', 'bar') === 42
 */
export const isString = ({
  matching,
  containing,
}: {
  matching?: RegExp;
  containing?: string;
} = {}): TypeMatcher<string> => {
  if (matching && containing) {
    throw new Error('You can only pass `matching` or `containing`, not both.');
  }

  return matches(
    (actual) => {
      if (typeof actual !== 'string') {
        return false;
      }

      if (containing) {
        return actual.indexOf(containing) !== -1;
      }

      return matching?.test(actual) ?? true;
    },
    {
      toJSON: () => {
        if (containing) {
          return `Matcher<string>('${containing}')`;
        }

        if (matching) {
          return `Matcher<string>(${matching})`;
        }

        return 'Matcher<string>';
      },
      getDiff: (actual) => {
        if (containing) {
          return {
            expected: `Matcher<string>('${containing}')`,
            actual,
          };
        }

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
};
