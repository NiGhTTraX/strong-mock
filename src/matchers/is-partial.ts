import { cloneDeepWith, isPlainObject } from 'lodash';
import { printValue } from '../print';
import type { Property } from '../proxy';
import { deepEquals } from './deep-equals';
import { isArray } from './is-array';
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
    getKeys(expected).map((key) => {
      const expectedValue = getKey(expected, key);
      const actualValue = getKey(actual, key);

      if (isMatcher(expectedValue)) {
        return [key, expectedValue.getDiff(actualValue).expected];
      }

      if (looksLikeObject(expectedValue)) {
        return [key, getExpectedObjectDiff(actualValue, expectedValue)];
      }

      return [key, expectedValue];
    })
  );

const getActualObjectDiff = (actual: unknown, expected: ObjectType): unknown =>
  Object.fromEntries(
    getKeys(expected).map((key) => {
      const expectedValue = getKey(expected, key);
      const actualValue = getKey(actual, key);

      if (isMatcher(expectedValue)) {
        return [key, expectedValue.getDiff(actualValue).actual];
      }

      if (looksLikeObject(expectedValue)) {
        return [key, getActualObjectDiff(actualValue, expectedValue)];
      }

      return [key, actualValue];
    })
  );

const getKeys = (value: unknown): Property[] => {
  if (typeof value === 'object' && value !== null) {
    return Reflect.ownKeys(value);
  }

  return [];
};

const getKey = (value: unknown, key: Property): unknown =>
  // @ts-expect-error because we're fine with a runtime undefined value
  value?.[key];

const isMatch = (actual: unknown, expected: ObjectType): boolean => {
  const actualKeys = getKeys(actual);
  const expectedKeys = getKeys(expected);

  if (!isArray(expectedKeys).matches(actualKeys)) {
    return false;
  }

  return expectedKeys.every((key) => {
    const expectedValue = getKey(expected, key);
    const actualValue = getKey(actual, key);

    if (isMatcher(expectedValue)) {
      return expectedValue.matches(actualValue);
    }

    if (looksLikeObject(expectedValue)) {
      return isMatch(actualValue, expectedValue);
    }

    return deepEquals(expectedValue).matches(actualValue);
  });
};

const deepPrintObject = (value: ObjectType) =>
  cloneDeepWith(value, (value) => {
    if (isMatcher(value)) {
      return value.toString();
    }

    return undefined;
  });

/**
 * Check if an object recursively contains the expected properties,
 * i.e. the expected object is a subset of the received object.
 *
 * @param partial A subset of the expected object that will be recursively matched.
 *   Supports nested matchers.
 *   Concrete values will be compared with {@link deepEquals}.
 *   Note that a `{}` partial will match ANY value including non-objects.
 *   Use {@link isPlainObject} if you want to match any plain object.
 *
 * @example
 * const fn = mock<(pos: { x: number, y: number }) => number>();
 * when(() => fn(It.isPartial({ x: 23 }))).returns(42);
 *
 * fn({ x: 23, y: 200 }) // returns 42
 *
 * @example
 * It.isPartial({ foo: It.isString() })
 */
export const isPartial = <T extends ObjectType, K extends DeepPartial<T>>(
  partial: K
): TypeMatcher<T> =>
  matches((actual) => isMatch(actual, partial), {
    toString: () => `Matcher<object>(${printValue(deepPrintObject(partial))})`,
    getDiff: (actual) => ({
      actual: getActualObjectDiff(actual, partial),
      expected: getExpectedObjectDiff(actual, partial),
    }),
  });
