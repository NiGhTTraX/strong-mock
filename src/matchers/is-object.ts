import { printExpected } from 'jest-matcher-utils';
import { isEqual, isPlainObject } from 'lodash';
import stripAnsi from 'strip-ansi';
import { printArg } from '../print';
import type { Property } from '../proxy';
import type { TypeMatcher } from './matcher';
import { isMatcher, matches } from './matcher';

type ObjectType = Record<Property, unknown>;
type DeepPartial<T> = T extends ObjectType
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;
const looksLikeObject = (value: unknown): value is ObjectType =>
  isPlainObject(value);
const getExpectedObjectDiff = (actual: unknown, expected: ObjectType): object =>
  Object.fromEntries(
    Reflect.ownKeys(expected).map((key) => {
      const right = expected[key];
      const left = looksLikeObject(actual) ? actual[key] : actual;

      if (isMatcher(right)) {
        return [key, right.getDiff(left).expected];
      }

      if (looksLikeObject(right)) {
        return [key, getExpectedObjectDiff(left, right)];
      }

      return [key, right];
    })
  );
const getActualObjectDiff = (actual: unknown, expected: ObjectType): object =>
  Object.fromEntries(
    Reflect.ownKeys(expected).map((key) => {
      const right = expected[key];
      const left = looksLikeObject(actual) ? actual[key] : actual;

      if (isMatcher(right)) {
        return [key, right.getDiff(left).actual];
      }

      if (looksLikeObject(right)) {
        return [key, getActualObjectDiff(left, right)];
      }

      return [key, left];
    })
  );
const isMatch = (actual: unknown, expected: ObjectType): boolean =>
  Reflect.ownKeys(expected).every((key) => {
    const right = expected[key];
    const left = looksLikeObject(actual) ? actual[key] : actual;

    if (!left) {
      return false;
    }

    if (isMatcher(right)) {
      return right.matches(left);
    }

    if (looksLikeObject(right)) {
      return isMatch(left, right);
    }

    return isEqual(left, right);
  });

/**
 * Match any plain object.
 *
 * Object like values, e.g. classes and arrays, will not be matched against this.
 *
 * @param partial An optional subset of the expected object that will be
 *   recursively matched. Supports nested matcher.
 *
 * @example
 * const fn = mock<(pos: { x: number, y: number }) => number>();
 * when(() => fn(It.isObject({ x: 23 }))).returns(42);
 *
 * fn({ x: 100, y: 200 }) // throws
 * fn({ x: 23, y: 200 }) // returns 42
 *
 * @example
 * It.isObject({ foo: It.isString() })
 */
export const isObject = <T extends ObjectType, K extends DeepPartial<T>>(
  partial?: K
): TypeMatcher<T> =>
  matches(
    (actual) => {
      if (!isPlainObject(actual)) {
        return false;
      }

      if (!partial) {
        return true;
      }

      return isMatch(actual, partial);
    },
    {
      toJSON: () =>
        partial ? `Matcher<object>(${printExpected(partial)})` : 'object',
      getDiff: (actual) => {
        if (!partial) {
          return {
            expected: 'Matcher<object>',
            actual: `${stripAnsi(printArg(actual))} (${
              isPlainObject(actual) ? 'object' : 'not object'
            })`,
          };
        }

        return {
          actual: getActualObjectDiff(actual, partial),
          expected: getExpectedObjectDiff(actual, partial),
        };
      },
    }
  );
