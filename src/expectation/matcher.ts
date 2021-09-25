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
 * The default matcher that checks for deep equality.
 */
export const deepEquals = <T>(expected: T): TypeMatcher<T> => {
  const matcher: Matcher = {
    matches: (received) => isEqual(received, expected),
    __isMatcher: true,

    toJSON() {
      return printArg(expected);
    },
  };

  return matcher as any;
};

/**
 * Match any value, including `undefined` and `null`.
 *
 * @example
 * const fn = mock<(x: number, y: string) => number>();
 * when(fn(It.isAny(), It.isAny())).thenReturn(1);
 *
 * instance(fn)(23, 'foobar') === 1
 */
const isAny = (): TypeMatcher<any> => {
  const matcher: Matcher = {
    matches: () => true,
    __isMatcher: true,

    toJSON() {
      return 'anything';
    },
  };

  return matcher as any;
};

/**
 * Match a custom predicate.
 *
 * @param cb Will receive the value and returns whether it matches.
 *
 * @example
 * const fn = mock<(x: number) => number>();
 * when(fn(It.matches(x => x >= 0))).returns(42);
 *
 * instance(fn)(2) === 42
 * instance(fn)(-1) // throws
 */
const matches = <T>(cb: (arg: T) => boolean): TypeMatcher<T> => {
  const matcher: Matcher = {
    matches: (arg: T) => cb(arg),
    __isMatcher: true,

    toJSON() {
      return `matches(${cb.toString()})`;
    },
  };

  return matcher as any;
};

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
): TypeMatcher<T> => {
  const matcher: Matcher = {
    __isMatcher: true,
    matches: (arg) =>
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
  };

  return matcher as any;
};

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
const isNumber = (): TypeMatcher<number> => {
  const matcher: Matcher = {
    __isMatcher: true,
    matches: (arg) => typeof arg === 'number' && !Number.isNaN(arg),
    toJSON: () => 'number',
  };

  return matcher as any;
};

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

  const matcher: Matcher = {
    __isMatcher: true,
    matches: (arg) => {
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
  };

  return matcher as any;
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
const isArray = <T extends any[]>(containing?: T): TypeMatcher<T> => {
  const matcher: Matcher = {
    __isMatcher: true,
    matches: (arg) => {
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
  };

  return matcher as any;
};

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
    matches: (value) => {
      capturedValue = value;

      return true;
    },
    toJSON(): string {
      return name ?? 'captures';
    },
    get value(): T | undefined {
      return capturedValue;
    },
  };

  return matcher as any;
};

/**
 * Compare values using `Object.is`.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 */
const is = <T = unknown>(expected: T): TypeMatcher<T> => {
  const matcher: Matcher = {
    __isMatcher: true,
    matches: (actual) => Object.is(actual, expected),
    toJSON: () => `${printExpected(expected)}`,
  };

  return matcher as any;
};

/**
 * Contains argument matchers that can be used to ignore arguments in an
 * expectation or to match complex arguments.
 */
export const It = {
  is,
  isAny,
  matches,
  isObject,
  isNumber,
  isString,
  isArray,
  willCapture,
};
