import { cloneDeepWith, isPlainObject } from 'lodash';
import { printValue } from '../print';
import type { Property } from '../proxy';
import { deepEquals } from './deep-equals';
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
      // @ts-expect-error because we're fine with a runtime undefined
      const left = actual?.[key];

      if (isMatcher(right)) {
        return [key, right.getDiff(left).expected];
      }

      if (looksLikeObject(right)) {
        return [key, getExpectedObjectDiff(left, right)];
      }

      return [key, right];
    })
  );

const getActualObjectDiff = (
  actual: unknown,
  expected: ObjectType
): unknown => {
  if (!looksLikeObject(actual)) {
    return actual;
  }

  return Object.fromEntries(
    Reflect.ownKeys(expected).map((key) => {
      const right = expected[key];
      const left = actual[key];

      if (!left) {
        return [];
      }

      if (isMatcher(right)) {
        return [key, right.getDiff(left).actual];
      }

      if (looksLikeObject(right)) {
        return [key, getActualObjectDiff(left, right)];
      }

      return [key, left];
    })
  );
};

const isMatch = (actual: unknown, expected: ObjectType): boolean =>
  Reflect.ownKeys(expected).every((key) => {
    const right = expected[key];
    const left = looksLikeObject(actual) ? actual[key] : undefined;

    if (!left) {
      return false;
    }

    if (isMatcher(right)) {
      return right.matches(left);
    }

    if (looksLikeObject(right)) {
      return isMatch(left, right);
    }

    return deepEquals(right).matches(left);
  });

const deepPrintObject = (value: ObjectType) =>
  cloneDeepWith(value, (value) => {
    if (isMatcher(value)) {
      return value.toString();
    }

    return undefined;
  });

/**
 * Match any plain object.
 *
 * Object like values, e.g. classes and arrays, will not be matched.
 *
 * @param partial An optional subset of the expected object that will be
 *   recursively matched. Supports nested matchers. Values will be
 *   compared with {@link deepEquals}.
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
      if (!looksLikeObject(actual)) {
        return false;
      }

      if (!partial) {
        return true;
      }

      return isMatch(actual, partial);
    },
    {
      toString: () => {
        if (!partial) {
          return 'Matcher<object>';
        }

        return `Matcher<object>(${printValue(deepPrintObject(partial))})`;
      },
      getDiff: (actual) => {
        if (!partial) {
          return {
            expected: 'Matcher<object>',
            actual: `${printValue(actual)}`,
          };
        }

        return {
          actual: getActualObjectDiff(actual, partial),
          expected: getExpectedObjectDiff(actual, partial),
        };
      },
    }
  );
