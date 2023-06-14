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
          return `string('${containing}')`;
        }

        if (matching) {
          return `string(${matching})`;
        }

        return 'string';
      },
      getDiff: (actual) => {
        if (typeof actual !== 'string') {
          return {
            expected: 'string',
            actual: `${actual} (${typeof actual})`,
          };
        }

        if (containing) {
          if (actual.indexOf(containing) === -1) {
            return {
              expected: `string containing '${containing}'`,
              actual,
            };
          }
        }

        if (matching) {
          if (!matching.test(actual)) {
            return {
              expected: `string matching ${matching}`,
              actual,
            };
          }
        }

        // Return the actual value twice to get a 0-diff.
        return {
          expected: actual,
          actual,
        };
      },
    }
  );
};
