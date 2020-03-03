export type Matcher<T> = T & {
  /**
   * Will be called with a value to match against.
   */
  matches: (arg: any) => boolean;

  /**
   * TODO: turn into a symbol
   */
  __isMatcher: boolean;

  /**
   * Used by `pretty-format`.
   */
  toJSON(): string;
};

/**
 * Use to test if an expectation on an argument is a custom matcher.
 */
export function isMatcher(f: any): f is Matcher<any> {
  return (<Matcher<any>>f).__isMatcher;
}

/**
 * Match any value, including `undefined` and `null`.
 *
 * @example
 * const fn = mock<(x: number, y: string) => number>();
 * when(fn(It.isAny(), It.isAny()).thenReturn(1);
 * instance(fn)(23, 'foobar') === 1
 */
const isAny = (): Matcher<any> => ({
  matches: () => true,
  __isMatcher: true,

  /**
   * Used by `pretty-format`.
   */
  toJSON() {
    return 'anything';
  }
});

/**
 * Match a custom predicate.
 *
 * @param cb Will receive the value and returns whether it matches.
 *
 * @example
 * const fn = mock<(x: number) => number>();
 * when(fn(It.matches(x => x >= 0)).returns(42);
 * instance(fn)(-1) // throws
 *
 * @param cb
 */
const matches = <T>(cb: (arg: T) => boolean): Matcher<T> =>
  ({
    matches: (arg: any) => cb(arg),
    __isMatcher: true,

    toJSON() {
      return `matches(${cb.toString()})`;
    }
  } as any);

/**
 * Contains argument matchers that can be used to ignore arguments in an
 * expectation or to match complex arguments.
 */
// TODO: add matchesObject, matchesString
export const It = {
  isAny,
  matches
};
