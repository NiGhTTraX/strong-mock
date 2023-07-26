export const MATCHER_SYMBOL = Symbol('matcher');

export type MatcherOptions = {
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
   *   toString: () => 'never'
   * });
   * when(() => fn(neverMatcher)).thenReturn(42);
   *
   * fn(42);
   * // Unmet expectations:
   * // when(() => fn(never)).thenReturn(42)
   */
  toString: () => string;
};

/**
 * You MUST use {@link It.matches} to create this branded type.
 */
export interface Matcher extends MatcherOptions {
  [MATCHER_SYMBOL]: boolean;

  /**
   * Will be called with the received value and should return whether it matches
   * the expectation.
   */
  matches: (actual: any) => boolean;
}

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
 * @param options
 * @param options.toString An optional function that should return a string that will be
 *   used when the matcher needs to be printed in an error message. By default,
 *   it stringifies `predicate`.
 * @param options.getDiff An optional function that will be called when printing the
 *   diff for a failed expectation. It will only be called if there's a mismatch
 *   between the expected and received values i.e. `predicate(actual)` fails.
 *   By default, the `toString` method will be used to format the expected value,
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
  options?: Partial<MatcherOptions>
): TypeMatcher<T> => {
  // We can't use destructuring with default values because `options` is optional,
  // so it needs a default value of `{}`, which will come with a native `toString`.
  const toString =
    options?.toString ?? (() => `Matcher(${predicate.toString()})`);
  const getDiff =
    options?.getDiff ??
    ((actual) => ({
      actual,
      expected: toString(),
    }));

  const matcher: Matcher = {
    [MATCHER_SYMBOL]: true,
    matches: (actual: T) => predicate(actual),
    toString,
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
