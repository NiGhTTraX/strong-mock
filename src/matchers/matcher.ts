export const MATCHER_SYMBOL = Symbol('matcher');

type MatcherOptions = {
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
   * @example
   * const neverMatcher = It.matches(() => false, {
   *   getDiff: (actual) => ({ actual, expected: 'never' })
   * });
   *
   * when(() => fn(neverMatcher)).thenReturn(42);
   *
   * fn(42);
   * // - Expected
   * // + Received
   * //
   * //   - 'never'
   * //   + 42
   */
  getDiff: (actual: any) => { actual: any; expected: any };

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
   * // Unmet expectations:
   * // when(() => fn(never)).thenReturn(42)
   */
  toJSON: () => string;
};

/**
 * You MUST use {@link It.matches} to create this branded type.
 */
export type Matcher = MatcherOptions & {
  [MATCHER_SYMBOL]: boolean;

  /**
   * Will be called with the received value and should return whether it matches
   * the expectation.
   */
  matches: (actual: any) => boolean;
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
 * @param predicate Will receive the actual value and return whether it matches the expectation.
 * @param toJSON An optional function that should return a string that will be
 *   used when the matcher needs to be printed in an error message. By default,
 *   it stringifies `predicate`.
 * @param getDiff An optional function that will be called when printing the
 *   diff for a failed expectation. It will only be called if there's a mismatch
 *   between the expected and received values i.e. `predicate(actual)` fails.
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
 */
export const matches = <T>(
  predicate: (actual: T) => boolean,
  {
    toJSON = () => `Matcher(${predicate.toString()})`,
    getDiff = (actual) => ({
      actual,
      expected: toJSON(),
    }),
  }: Partial<MatcherOptions> = {}
): TypeMatcher<T> => {
  const matcher: Matcher = {
    [MATCHER_SYMBOL]: true,
    matches: (actual: T) => predicate(actual),
    toJSON,
    getDiff: (actual) => {
      if (predicate(actual)) {
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
