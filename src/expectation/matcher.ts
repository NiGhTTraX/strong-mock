import { printExpected } from 'jest-matcher-utils';
import isEqual from 'lodash/isEqual';
import isMatchWith from 'lodash/isMatchWith';
import { printArg } from '../print';

export type Matcher = {
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
 * This takes the shape of T to satisfy call sites, but strong-mock will only
 * care about the matcher type.
 */
export type TypeMatcher<T> = T & Matcher;

/**
 * Used to test if an expectation on an argument is a custom matcher.
 */
export function isMatcher(f: unknown): f is Matcher {
  return !!(f && (<Matcher>f).__isMatcher);
}

/**
 * Match a custom predicate.
 *
 * @param cb Will receive the value and returns whether it matches.
 * @param toJSON An optional function that should return a string that will be
 *   used when the matcher needs to be printed in an error message. By default,
 *   it stringifies `cb`.
 *
 * @example
 * const fn = mock<(x: number) => number>();
 * when(fn(It.matches(x => x >= 0))).returns(42);
 *
 * instance(fn)(2) === 42
 * instance(fn)(-1) // throws
 */
const matches = <T>(
  cb: (actual: T) => boolean,
  toJSON: () => string = () => `matches(${cb.toString()})`
): TypeMatcher<T> => {
  const matcher: Matcher = {
    __isMatcher: true,
    matches: (arg: T) => cb(arg),
    toJSON,
  };

  return matcher as any;
};

/**
 * Compare values using deep equality.
 *
 * @see It.is A matcher that uses strict equality.
 */
const deepEquals = <T>(expected: T): TypeMatcher<T> =>
  matches(
    (actual) => isEqual(actual, expected),
    () => printArg(expected)
  );

/**
 * Compare values using `Object.is`.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 *
 * @see It.deepEquals A matcher that uses deep equality.
 */
const is = <T = unknown>(expected: T): TypeMatcher<T> =>
  matches(
    (actual) => Object.is(actual, expected),
    () => `${printExpected(expected)}`
  );

/**
 * Match any value, including `undefined` and `null`.
 *
 * @example
 * const fn = mock<(x: number, y: string) => number>();
 * when(fn(It.isAny(), It.isAny())).thenReturn(1);
 *
 * instance(fn)(23, 'foobar') === 1
 */
const isAny = (): TypeMatcher<any> =>
  matches(
    () => true,
    () => 'anything'
  );

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
 * when(fn(It.isObject({ x: 23 }))).returns(42);
 *
 * instance(fn)({ x: 100, y: 200 }) // throws
 * instance(fn)({ x: 23, y: 200 }) // returns 42
 *
 * @example
 * It.isObject({ foo: It.isString() })
 */
const isObject = <T extends object, K extends DeepPartial<T>>(
  partial?: K
): TypeMatcher<T> =>
  matches(
    (actual) =>
      isMatchWith(actual, partial || {}, (argValue, partialValue) => {
        if (isMatcher(partialValue)) {
          return partialValue.matches(argValue);
        }

        // Let lodash handle it otherwise.
        return undefined;
      }),
    () => (partial ? `object(${printExpected(partial)})` : 'object')
  );

/**
 * Match any number.
 *
 * @example
 * const fn = mock<(x: number) => number>();
 * when(fn(It.isNumber())).returns(42);
 *
 * instance(fn)(20.5) === 42
 * instance(fn)(NaN) // throws
 */
const isNumber = (): TypeMatcher<number> =>
  matches(
    (actual) => typeof actual === 'number' && !Number.isNaN(actual),
    () => 'number'
  );

/**
 * Match a string, potentially by a pattern.
 *
 * @param matching The string has to match this RegExp.
 * @param containing The string has to contain this substring.
 *
 * @example
 * const fn = mock<(x: string, y: string) => number>();
 * when(fn(It.isString(), It.isString({ containing: 'bar' }))).returns(42);
 *
 * instance(fn)('foo', 'baz') // throws
 * instance(fn)('foo', 'bar') === 42
 */
const isString = ({
  matching,
  containing,
}: { matching?: RegExp; containing?: string } = {}): TypeMatcher<string> => {
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
    () =>
      containing || matching
        ? `string(${printExpected(containing || matching)})`
        : 'string'
  );
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
 * when(fn(It.isArray([2, 3]))).thenReturn(2);
 *
 * instance(fn)({ length: 1, 0: 42 }) // throws
 * instance(fn)([]) === 1
 * instance(fn)([3, 2, 1]) === 2
 *
 * @example
 * It.isArray([It.isString({ containing: 'foobar' })])
 */
const isArray = <T extends any[]>(containing?: T): TypeMatcher<T> =>
  matches(
    (actual) => {
      if (!Array.isArray(actual)) {
        return false;
      }

      if (!containing) {
        return true;
      }

      return containing.every(
        (x) =>
          actual.find((y) => {
            if (isMatcher(x)) {
              return x.matches(y);
            }

            return isEqual(x, y);
          }) !== undefined
      );
    },
    () => (containing ? `array(${printExpected(containing)})` : 'array')
  );

/**
 * Matches anything and stores the received value.
 *
 * This should not be needed for most cases, but can be useful if you need
 * access to a complex argument outside the expectation e.g. to test a
 * callback.
 *
 * @param name If given, this name will be printed in error messages.
 *
 * @example
 * const fn = mock<(cb: (value: number) => number) => void>();
 * const matcher = It.willCapture();
 * when(fn(matcher)).thenReturn();
 *
 * instance(fn)(x => x + 1);
 * matcher.value?.(3) === 4
 */
const willCapture = <T = unknown>(
  name?: string
): TypeMatcher<T> & { value: T | undefined } => {
  let capturedValue: T | undefined;

  const matcher: Matcher & { value: T | undefined } = {
    __isMatcher: true,
    matches: (actual) => {
      capturedValue = actual;

      return true;
    },
    toJSON: () => name ?? 'captures',
    get value(): T | undefined {
      return capturedValue;
    },
  };

  return matcher as any;
};

/**
 * Contains argument matchers that can be used to ignore arguments in an
 * expectation or to match complex arguments.
 */
export const It = {
  matches,
  deepEquals,
  is,
  isAny,
  isObject,
  isNumber,
  isString,
  isArray,
  willCapture,
};
