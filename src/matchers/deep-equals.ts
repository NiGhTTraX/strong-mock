import {
  cloneDeep,
  cloneDeepWith,
  isEqualWith,
  isMap,
  isObjectLike,
  omitBy,
} from 'lodash';
import { deepPrint, printValue } from '../print.js';
import type { TypeMatcher } from './matcher.js';
import { isMatcher, matches } from './matcher.js';

const removeUndefined = (object: any): any => {
  if (Array.isArray(object)) {
    return object.map((x) => removeUndefined(x));
  }

  if (!isObjectLike(object)) {
    return object;
  }

  return omitBy(object, (value) => value === undefined);
};

const getKey = (
  key: number | string | undefined,
  object: Record<string, unknown>,
) => {
  if (key === undefined) {
    return object;
  }

  return isMap(object) ? object.get(key) : object[key];
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
        let actualResult = cloneDeep(actual);

        const expectedResult = cloneDeepWith(expected, (expectedValue, key) => {
          const actualValue = getKey(key, actualResult);

          if (isMatcher(expectedValue)) {
            if (expectedValue.matches(actualValue)) {
              return actualValue;
            }

            const result = expectedValue.getDiff(actualValue);

            if (key !== undefined) {
              if (isMap(actualResult)) {
                actualResult.set(key, result.actual);
              } else {
                actualResult[key] = result.actual;
              }
            } else {
              actualResult = result.actual;
            }

            return result.expected;
          }

          return undefined;
        });

        return {
          actual: actualResult,
          expected: expectedResult,
        };
      },
    },
  );
