import cloneDeep from 'lodash/cloneDeep.js';
import cloneDeepWith from 'lodash/cloneDeepWith.js';
import isEqualWith from 'lodash/isEqualWith.js';
import isMap from 'lodash/isMap.js';
import isObjectLike from 'lodash/isObjectLike.js';
import isSet from 'lodash/isSet.js';
import { deepPrint, printValue } from '../print.js';
import type { TypeMatcher } from './matcher.js';
import { isMatcher, matches } from './matcher.js';

const removeUndefined = (object: any): any => {
  if (Array.isArray(object)) {
    return object.map((x) => removeUndefined(x));
  }

  if (isMap(object)) {
    return new Map(
      [...object].map(([key, value]): [any, any] => [
        removeUndefined(key),
        removeUndefined(value),
      ]),
    );
  }

  if (isSet(object)) {
    return new Set([...object].map((x) => removeUndefined(x)));
  }

  if (!isObjectLike(object)) {
    return object;
  }

  // Don't recurse into built-in objects like Date, Buffer, etc.
  if (Object.prototype.toString.call(object) !== '[object Object]') {
    return object;
  }

  return Reflect.ownKeys(object).reduce((result: any, key) => {
    const value = object[key];

    if (
      Object.prototype.propertyIsEnumerable.call(object, key) &&
      value !== undefined
    ) {
      result[key] = removeUndefined(value);
    }

    return result;
  }, {});
};

const getKey = (
  key: number | string | symbol | undefined,
  object: unknown,
): unknown => {
  if (key === undefined) {
    return object;
  }

  if (isMap(object)) {
    return object.get(key);
  }

  if (isObjectLike(object)) {
    return (object as Record<string | symbol, unknown>)[key];
  }

  return undefined;
};

/**
 * Compare values using deep equality.
 *
 * This is the default matcher that's automatically used when no other matcher
 * is specified. You can change it with the `concreteMatcher` option when creating
 * a {@link mock}, or set a new default with {@link setDefaults}.
 *
 * @param expected Supports nested matchers for objects, arrays, and Maps.
 * @param strict By default, this matcher will treat a missing key in an object
 *   and a key with the value `undefined` as not equal. It will also consider
 *   non `Object` instances with different constructors as not equal. Setting
 *   this to `false` will consider the objects in both cases as equal.
 *
 * @see {@link It.containsObject} or {@link It.isArray} for partially matching
 *   objects or arrays respectively.
 * @see {@link It.is} for strict equality.
 *
 * @example
 * const fn = mock<(x: { foo: { bar: number } }) => number>();
 *
 * // deepEquals is the default matcher.
 * when(() => fn({ foo: { bar: 42 } })).thenReturn(1);
 *
 * // With nested matchers:
 * when(() => fn({ foo: { bar: It.isNumber() } })).thenReturn(2);
 */
export const deepEquals = <T>(
  expected: T,
  {
    strict = true,
  }: {
    strict?: boolean;
  } = {},
): TypeMatcher<T> =>
  matches(
    (actual) =>
      isEqualWith(
        strict ? actual : removeUndefined(actual),
        strict ? expected : removeUndefined(expected),
        (actualValue, expectedValue) => {
          if (isMatcher(expectedValue)) {
            return expectedValue.matches(actualValue);
          }

          return undefined;
        },
      ),
    {
      toString: () => printValue(deepPrint(expected)),
      getDiff: (actual) => {
        // `cloneDeepWith` calls the customizer with the current key of `expected`,
        // its value, and its parent. To get the corresponding value for `actual`,
        // we need to keep a 1:1 map of parents.
        //
        //   expected                     actual
        // { foo: { bar: 1 } }           { foo: { bar: 2 } }
        //           │                      ▲
        //    ┌──────┘                      │
        //    │                             │
        //    │      [expected.foo, actual.foo]
        //    │                 ▲
        //    ▼                 │
        //  [bar], 1, expected.foo
        const actualParents = new Map<object, unknown>();

        let actualResult = cloneDeep(actual);

        if (isObjectLike(expected)) {
          actualParents.set(expected as object, actualResult);
        }

        const expectedResult = cloneDeepWith(
          expected,
          (expectedValue, key, expectedParent) => {
            // The first call is with the root value.
            if (!expectedParent) {
              if (isMatcher(expectedValue)) {
                const result = expectedValue.getDiff(actualResult);
                actualResult = result.actual;

                return result.expected;
              }

              return undefined;
            }

            const actualParent = actualParents.get(expectedParent);
            const actualValue = getKey(key, actualParent);

            if (!isMatcher(expectedValue)) {
              if (isObjectLike(expectedValue)) {
                actualParents.set(expectedValue as object, actualValue);
              }

              return undefined;
            }

            if (expectedValue.matches(actualValue)) {
              return actualValue;
            }

            const result = expectedValue.getDiff(actualValue);

            if (key !== undefined) {
              if (isMap(actualParent)) {
                actualParent.set(key, result.actual);
              } else {
                (actualParent as Record<string, unknown>)[key] = result.actual;
              }
            }

            return result.expected;
          },
        );

        return {
          actual: actualResult,
          expected: expectedResult,
        };
      },
    },
  );
