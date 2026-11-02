import { describe, expect, it } from 'vitest';
import { expectAnsilessEqual } from '../../tests/ansiless.js';
import { containsObject } from './contains-object.js';
import { isArray } from './is-array.js';
import { isString } from './is-string.js';
import { matches } from './matcher.js';

describe('isArray', () => {
  it('should match an empty array', () => {
    expect(isArray().matches([])).toBeTruthy();
  });

  it('should not match array likes', () => {
    expect(isArray().matches({ length: 0 })).toBeFalsy();
    expect(isArray().matches(new Set([1, 2, 3]))).toBeFalsy();
  });

  it('should match a non-empty array', () => {
    expect(isArray().matches([1, '2', true, {}])).toBeTruthy();
  });

  it('should match an array containing an empty array', () => {
    expect(isArray([]).matches([1, '2', true, {}])).toBeTruthy();
    expect(isArray([]).matches([])).toBeTruthy();
  });

  it('should match arrays that include the given sub-array', () => {
    expect(isArray([2, 3]).matches([1, 2, 3, 4])).toBeTruthy();
    expect(isArray([2, 3]).matches([3, 4])).toBeFalsy();
    expect(isArray([1, 2]).matches([1, 2, 3, 4])).toBeTruthy();
    expect(isArray([1, 2]).matches([2])).toBeFalsy();
    expect(isArray([3, 4]).matches([1, 2, 3, 4])).toBeTruthy();
    expect(isArray([1, 2, 3, 4]).matches([1, 2, 3, 4])).toBeTruthy();
  });

  it('should match arrays that includes all elements in the given array, in any order', () => {
    expect(isArray([1, 2, 3]).matches([3, 2, 1])).toBeTruthy();
    expect(isArray([3, 2, 1]).matches([1, 1, 2, 2, 3, 3])).toBeTruthy();
  });

  it('should match undefined values', () => {
    expect(isArray([undefined]).matches([undefined])).toBeTruthy();
    expect(isArray([undefined]).matches([1, undefined, 2])).toBeTruthy();
    expect(isArray([undefined]).matches([1, 2])).toBeFalsy();
  });

  it('should not treat sparse array slots as undefined values', () => {
    // eslint-disable-next-line no-sparse-arrays
    const sparseActual = [1, , 2];

    expect(isArray([undefined]).matches(new Array(1))).toBeFalsy();
    expect(isArray([undefined]).matches(sparseActual)).toBeFalsy();
    expect(isArray([1, undefined, 2]).matches(sparseActual)).toBeFalsy();
  });

  it('should ignore sparse slots in the expected array', () => {
    // eslint-disable-next-line no-sparse-arrays
    const sparseExpected = [1, , 3];

    expect(isArray(new Array(1)).matches([])).toBeTruthy();
    expect(isArray(new Array(1)).matches([undefined])).toBeTruthy();
    expect(isArray(sparseExpected).matches([3, 1])).toBeTruthy();
    expect(isArray(sparseExpected).matches([1])).toBeFalsy();
  });

  it('should match duplicated values', () => {
    expect(isArray([1, 1]).matches([1])).toBeFalsy();
    expect(isArray([1, 1]).matches([1, 2])).toBeFalsy();
    expect(isArray([1, 1]).matches([1, 2, 1])).toBeTruthy();
  });

  it('should match arrays of objects', () => {
    expect(
      isArray([{ foo: 'bar' }]).matches([{ foo: 'bar' }, { foo: 'baz' }]),
    ).toBeTruthy();
    expect(
      isArray([{ foo: 'boo' }]).matches([{ foo: 'bar' }, { foo: 'baz' }]),
    ).toBeFalsy();
  });

  it('should match nested matchers', () => {
    expect(
      isArray([isString(), containsObject({ foo: 'bar' })]).matches([
        'foo',
        { foo: 'bar' },
      ]),
    ).toBeTruthy();

    expect(isArray([isString('foobar')]).matches(['foo'])).toBeFalsy();
  });

  it('should pretty print', () => {
    expectAnsilessEqual(isArray().toString(), 'array');
    expectAnsilessEqual(isArray([1, 2, 3]).toString(), 'array([1, 2, 3])');
  });

  it('should pretty print nested matchers', () => {
    const matcher = matches(() => false, {
      toString: () => 'something',
      getDiff: () => {
        throw new Error();
      },
    });

    expectAnsilessEqual(
      isArray([matcher, matcher]).toString(),
      'array([something, something])',
    );
  });

  describe('diff', () => {
    it('should print type mismatches', () => {
      expect(isArray().getDiff(42)).toEqual({
        expected: 'Matcher<array>',
        actual: '42 (number)',
      });

      expect(isArray().getDiff({ foo: 'bar' })).toEqual({
        expected: 'Matcher<array>',
        actual: '{"foo": "bar"} (object)',
      });
    });

    it('should print arrays', () => {
      expect(isArray([1, 2]).getDiff([4, 3])).toEqual({
        expected: 'Matcher<array>([1, 2])',
        actual: [4, 3],
      });

      expect(isArray([2, 2]).getDiff([2])).toEqual({
        expected: 'Matcher<array>([2, 2])',
        actual: [2],
      });
    });

    it('should print falsy values', () => {
      expect(isArray([null, undefined, false, '']).getDiff(42)).toEqual({
        expected: 'Matcher<array>([null, undefined, false, ""])',
        actual: 42,
      });
    });

    it('should print sparse array holes', () => {
      expect(isArray(['foo', undefined, null, 42]).getDiff([1])).toEqual({
        expected: 'Matcher<array>(["foo", undefined, null, 42])',
        actual: [1],
      });

      // eslint-disable-next-line no-sparse-arrays
      const sparseExpected = [1, , 3];

      expect(isArray(sparseExpected).getDiff([1, 4])).toEqual({
        expected: 'Matcher<array>([1, , 3])',
        actual: [1, 4],
      });

      // eslint-disable-next-line no-sparse-arrays
      const sparseActual = [1, , 4];

      expect(isArray(sparseExpected).getDiff(sparseActual)).toEqual({
        expected: 'Matcher<array>([1, , 3])',
        actual: sparseActual,
      });
    });

    it('should print nested matchers', () => {
      const matcher = matches(() => false, {
        toString: () => 'something',
        getDiff: () => {
          throw new Error();
        },
      });

      expect(isArray([matcher, matcher]).getDiff([2])).toEqual({
        expected: 'Matcher<array>([something, something])',
        actual: [2],
      });
    });
  });
});
