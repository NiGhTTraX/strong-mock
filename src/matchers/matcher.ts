export const MATCHER_SYMBOL = Symbol('matcher');

type GetDiff = (actual: any) => { actual: any; expected: any };

/**
 * You MUST use {@link It.matches} to create this branded type.
 */
export type Matcher = {
  [MATCHER_SYMBOL]: boolean;

  /**
   * Will be called with the received value and should return whether it matches
   * the expectation.
   */
  matches: (actual: any) => boolean;

  /**
   * Will be called when printing the diff between an expectation and the
   * (mismatching) received arguments.
   *
   * With this function you can pretty print the `actual` and `expected` values
   * according to your matcher's logic.
   *
   * @param actual The actual value received by this matcher, same as the one
   *   in `matches`.
   *
   * @returns {actual, expected} pair that will be diffed visually in the
   *   error message.
   *
   * @example
   * const neverMatcher = It.matches(() => false, {
   *   getDiff: (actual) => ({ actual, expected: 'never' })
   * });
   *
   * when(() => fn(neverMatcher)).thenReturn(42);
   *
   * fn(42);
   *
   * // Will end up printing:
   * // - Expected
   * // + Received
   * //
   * //   - 42
   * //   + 'never'
   */
  getDiff: GetDiff;

  /**
   * Will be called when printing arguments for an unexpected or unmet expectation.
   *
   * @example
   * const neverMatcher = It.matches(() => false, {
   *   toJSON: () => 'never'
   * });
   * when(() => fn(neverMatcher)).thenReturn(42);
   *
   * fn(42);
   *
   * // Will end up printing:
   * // when(() => fn('never'))
   */
  toJSON: () => string;
};

/**
 * This takes the shape of T to satisfy call sites, but strong-mock will only
 * care about the matcher type.
 */
export type TypeMatcher<T> = T & Matcher;

/**
 * Used to test if an expectation is an argument is a custom matcher.
 */
export function isMatcher(f: unknown): f is Matcher {
  return !!(f && (<Matcher>f)[MATCHER_SYMBOL]);
}

export const getMatcherDiffs = (
  matchers: Matcher[],
  args: unknown[]
): { actual: unknown[]; expected: unknown[] } => {
  const matcherDiffs = matchers.map((matcher, i) => matcher.getDiff(args[i]));
  const actual = matcherDiffs.map((d) => d.actual);
  const expected = matcherDiffs.map((d) => d.expected);

  return { actual, expected };
};

/**
 * Create a custom matcher.
 *
 * @param cb Will receive the actual value and returns whether it matches the expectation.
 * @param toJSON An optional function that should return a string that will be
 *   used when the matcher needs to be printed in an error message. By default,
 *   it stringifies `cb`.
 * @param getDiff An optional function that will be called when printing the
 *   diff for a failed expectation. It will only be called if there's a mismatch
 *   between the expected and received values i.e. `cb(actual)` fails.
 *   You can format both the received and the expected values according to your
 *   matcher's logic.
 *   By default, the `toJSON` method will be used to format the expected value,
 *   while the received value will be returned as-is.
 *
 * @example
 * // Create a matcher for positive numbers.
 * const fn = mock<(x: number) => number>();
 * when(() => fn(It.matches(x => x >= 0))).thenReturn(42);
 *
 * fn(2) === 42
 * fn(-1) // throws
 *
 * @example
 * // Create a matcher with a custom display name.
 * const matcher = It.matches(() => false, {
 *   toJSON: () => 'CustomMatcher'
 * });
 * when(() => fn(matcher)).thenReturn(42);
 *
 * fn(100);
 * // Unmet expectations:
 * // when(() => fn(CustomMatcher)).thenReturn(42);
 *
 * @example
 * // Create a matcher with a custom differ.
 * const foobar = It.matches<{ foo: string }>(
 *   actual => actual.foo === 'bar',
 *   {
 *     getDiff: actual => ({
 *       expected: { foo: 'bar' },
 *       actual: { foo: actual.foo },
 *     })
 *   }
 * );
 *
 * when(() => fn(foobar)).thenReturn(42);
 * fn({ foo: 'baz', extra: 'stuff' });
 * // + Expected
 * // - Received
 * //
 * //   - foo: 'bar'
 * //   + foo: 'baz'
 */
export const matches = <T>(
  cb: (actual: T) => boolean,
  {
    toJSON = () => `Matcher(${cb.toString()})`,
    getDiff = (actual) => ({
      actual,
      expected: toJSON(),
    }),
  }: Partial<Pick<Matcher, 'toJSON' | 'getDiff'>> = {}
): TypeMatcher<T> => {
  const matcher: Matcher = {
    [MATCHER_SYMBOL]: true,
    matches: (actual: T) => cb(actual),
    toJSON,
    getDiff: (actual) => {
      if (cb(actual)) {
        return {
          actual,
          expected: actual,
        };
      }

      return getDiff(actual);
    },
  };

  return matcher as any;
};
