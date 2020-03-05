import { printExpected } from 'jest-matcher-utils';
import isMatch from 'lodash/isMatch';

type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;

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
 * Recursively match an object.
 *
 * @param partial A subset of the expected objected.
 *
 * @example
 * const fn = mock<(foo: { x: number, y: number }) => number>();
 * when(fn(It.isObjectContaining({ x: 23 }).returns(42);
 * instance(fn)({ x: 100, y: 200 }) // throws
 * instance(fn)({ x: 23, y: 200 }) // returns 42
 */
const isObjectContaining = <T extends object, K extends DeepPartial<T>>(
  partial: K
): Matcher<T> => // matches(arg => isMatch(arg, partial));
  ({
    __isMatcher: true,
    matches: (arg: any) => isMatch(arg, partial),
    toJSON() {
      return `objectContaining(${printExpected(partial)})`;
    }
  } as any);

/**
 * Contains argument matchers that can be used to ignore arguments in an
 * expectation or to match complex arguments.
 */
// TODO: add isStringContaining
export const It = {
  isAny,
  matches,
  isObjectContaining
};
