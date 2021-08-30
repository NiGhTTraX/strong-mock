import { printExpected } from 'jest-matcher-utils';
import isEqual from 'lodash/isEqual';
import isMatchWith from 'lodash/isMatchWith';
import { printArg } from '../print';

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
export function isMatcher(f: unknown): f is Matcher<unknown> {
  return !!(f && (<Matcher<unknown>>f).__isMatcher);
}

/**
 * The default matcher that checks for deep equality.
 */
export const deepEquals = <T>(expected: T): Matcher<T> =>
  ({
    matches: (received: any) => isEqual(received, expected),
    __isMatcher: true,

    toJSON() {
      return printArg(expected);
    },
  } as any);

/**
 * Match any value, including `undefined` and `null`.
 *
 * @example
 * const fn = mock<(x: number, y: string) => number>();
 * when(fn(It.isAny(), It.isAny()).thenReturn(1);
 *
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
  },
});

/**
 * Match a custom predicate.
 *
 * @param cb Will receive the value and returns whether it matches.
 *
 * @example
 * const fn = mock<(x: number) => number>();
 * when(fn(It.matches(x => x >= 0)).returns(42);
 *
 * instance(fn)(2) === 42
 * instance(fn)(-1) // throws
 */
const matches = <T>(cb: (arg: T) => boolean): Matcher<T> =>
  ({
    matches: (arg: any) => cb(arg),
    __isMatcher: true,

    toJSON() {
      return `matches(${cb.toString()})`;
    },
  } as any);

type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;

/**
 * Recursively match an object.
 *
 * Supports nested matcher.
 *
 * @param partial An optional subset of the expected objected.
 *
 * @example
 * const fn = mock<(foo: { x: number, y: number }) => number>();
 * when(fn(It.isObject({ x: 23 }).returns(42);
 *
 * instance(fn)({ x: 100, y: 200 }) // throws
 * instance(fn)({ x: 23, y: 200 }) // returns 42
 *
 * @example
 * It.isObject({ foo: It.isString() })
 */
const isObject = <T extends object, K extends DeepPartial<T>>(
  partial?: K
): Matcher<T> =>
  ({
    __isMatcher: true,
    matches: (arg: any) =>
      isMatchWith(arg, partial || {}, (argValue, partialValue) => {
        if (isMatcher(partialValue)) {
          return partialValue.matches(argValue);
        }

        // Let lodash handle it otherwise.
        return undefined;
      }),
    toJSON() {
      return partial ? `object(${printExpected(partial)})` : 'object';
    },
  } as any);

/**
 * Match any number.
 *
 * @example
 * const fn = mock<(x: number) => number>();
 * when(fn(It.isNumber()).returns(42);
 *
 * instance(fn)(20.5) === 42
 * instance(fn)(NaN) // throws
 */
const isNumber = (): Matcher<number> =>
  ({
    __isMatcher: true,
    matches: (arg: any) => typeof arg === 'number' && !Number.isNaN(arg),
    toJSON: () => 'number',
  } as any);

/**
 * Match a string, potentially by a pattern.
 *
 * @param matching The string has to match this RegExp.
 * @param containing The string has to contain this substring.
 *
 * @example
 * const fn = mock<(x: string, y: string) => number>();
 * when(fn(It.isString(), It.isString({ containing: 'bar' }).returns(42);
 *
 * instance(fn)('foo', 'baz') // throws
 * instance(fn)('foo', 'bar') === 42
 */
const isString = ({
  matching,
  containing,
}: { matching?: RegExp; containing?: string } = {}): Matcher<string> => {
  if (matching && containing) {
    throw new Error('You can only pass `matching` or `containing`, not both.');
  }

  return {
    __isMatcher: true,
    matches: (arg: any) => {
      if (typeof arg !== 'string') {
        return false;
      }

      if (containing) {
        return arg.indexOf(containing) !== -1;
      }

      return matching?.test(arg) ?? true;
    },
    toJSON: () =>
      containing || matching
        ? `string(${printExpected(containing || matching)})`
        : 'string',
  } as any;
};

/**
 * Match an array.
 *
 * Supports nested matchers.
 *
 * @param containing If given, the matched array has to contain ALL of these
 *   elements in ANY order.
 *
 * @example
 * const fn = mock<(arr: number[]) => number>();
 * when(fn(It.isArray())).thenReturn(1);
 * when(fn(It.isArray([2, 3))).thenReturn(2);
 *
 * instance(fn)({ length: 1, 0: 42 }) // throws
 * instance(fn)([]]) === 1
 * instance(fn)([3, 2, 1) === 2
 *
 * @example
 * It.isArray([It.isString({ containing: 'foobar' }))
 */
const isArray = <T extends any[]>(containing?: T): Matcher<T> =>
  ({
    __isMatcher: true,
    matches: (arg: any) => {
      if (!Array.isArray(arg)) {
        return false;
      }

      if (!containing) {
        return true;
      }

      return containing.every(
        (x) =>
          arg.find((y) => {
            if (isMatcher(x)) {
              return x.matches(y);
            }

            return isEqual(x, y);
          }) !== undefined
      );
    },
    toJSON: () =>
      containing ? `array(${printExpected(containing)})` : 'array',
  } as any);

/**
 * Contains argument matchers that can be used to ignore arguments in an
 * expectation or to match complex arguments.
 */
export const It = {
  isAny,
  matches,
  isObject,
  isNumber,
  isString,
  isArray,
};
