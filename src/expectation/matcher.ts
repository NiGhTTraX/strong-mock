export const MATCHER_SYMBOL = Symbol('matcher');

/**
 * You should use {@link It.matches} to create this type.
 */
export type Matcher = {
  /**
   * Will be called with a value to match against.
   */
  matches: (actual: any) => boolean;

  [MATCHER_SYMBOL]: boolean;

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
   * @returns an {actual, expected} pair that will be diffed visually in the
   *   error message.
   *
   * @example
   * const neverMatcher = It.matches(() => false, {
   *   getDiff: () => ({ actual: 'something, expected: 'never' })
   * });
   * // Will end up printing:
   * - Expected
   * + Received
   *
   *   - 'something'
   *   + 'never
   */
  getDiff: (actual: any) => { actual: any; expected: any };

  /**
   * Used by `pretty-format`.
   */
  toJSON: () => string;
};

/**
 * This takes the shape of T to satisfy call sites, but strong-mock will only
 * care about the matcher type.
 */
export type TypeMatcher<T> = T & Matcher;

/**
 * Used to test if an expectation on an argument is a custom matcher.
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
