export const MATCHER_SYMBOL = Symbol('matcher');

export type Matcher = {
  /**
   * Will be called with a value to match against.
   */
  matches: (arg: any) => boolean;

  [MATCHER_SYMBOL]: boolean;

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
