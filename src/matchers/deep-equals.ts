import { printExpected } from 'jest-matcher-utils';
import { isEqual, isObjectLike, isUndefined, omitBy } from 'lodash';
import type { TypeMatcher } from './matcher';
import { matches } from './matcher';

const removeUndefined = (object: any): any => {
  if (Array.isArray(object)) {
    return object.map((x) => removeUndefined(x));
  }

  if (!isObjectLike(object)) {
    return object;
  }

  return omitBy(object, isUndefined);
};

/**
 * Compare values using deep equality.
 *
 * @param expected
 * @param strict By default, this matcher will treat a missing key in an object
 *   and a key with the value `undefined` as not equal. It will also consider
 *   non `Object` instances with different constructors as not equal. Setting
 *   this to `false` will consider the objects in both cases as equal.
 *
 * @see {@link It.isObject} or {@link It.isArray} if you want to nest matchers.
 * @see {@link It.is} if you want to use strict equality.
 */
export const deepEquals = <T>(
  expected: T,
  {
    strict = true,
  }: {
    strict?: boolean;
  } = {}
): TypeMatcher<T> =>
  matches(
    (actual) => {
      if (strict) {
        return isEqual(actual, expected);
      }

      return isEqual(removeUndefined(actual), removeUndefined(expected));
    },
    {
      toJSON: () => printExpected(expected),
      getDiff: (actual) => ({
        actual,
        expected,
      }),
    }
  );
