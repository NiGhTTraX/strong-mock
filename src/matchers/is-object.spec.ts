import { expectAnsilessEqual } from '../../tests/ansiless';
import { isArray } from './is-array';
import { isObject } from './is-object';
import { isString } from './is-string';
import { matches } from './matcher';

describe('isObject', () => {
  it('should not match non objects', () => {
    expect(isObject().matches('not an object')).toBeFalsy();
    expect(isObject().matches([])).toBeFalsy();
    expect(isObject().matches(null)).toBeFalsy();
    expect(isObject().matches(undefined)).toBeFalsy();
    expect(isObject().matches(new (class {})())).toBeFalsy();
  });

  it('should match any object with empty object', () => {
    expect(isObject().matches({})).toBeTruthy();
    expect(
      isObject().matches({
        foo: 'bar',
      })
    ).toBeTruthy();
  });

  it('should match objects with non string keys', () => {
    const foo = Symbol('foo');

    expect(isObject({ [foo]: 'bar' }).matches({ [foo]: 'bar' })).toBeTruthy();
    expect(isObject({ 100: 'bar' }).matches({ 100: 'bar' })).toBeTruthy();

    expect(isObject({ [foo]: 'bar' }).matches({ [foo]: 'baz' })).toBeFalsy();
    expect(isObject({ 100: 'bar' }).matches({ 100: 'baz' })).toBeFalsy();
    expect(isObject({ 100: 'bar' }).matches({ 101: 'bar' })).toBeFalsy();
  });

  it('should deep match nested objects', () => {
    expect(
      isObject({ foo: { bar: { baz: 42 } } }).matches({
        foo: { bar: { baz: 42, bazzz: 23 } },
      })
    ).toBeTruthy();

    expect(
      isObject({ foo: { bar: { baz: 43 } } }).matches({
        foo: { bar: { baz: 42, bazzz: 23 } },
      })
    ).toBeFalsy();

    expect(isObject({ foo: 'bar' }).matches('not object')).toBeFalsy();

    expect(
      isObject({ foo: { bar: { baz: 42 } } }).matches({ foo: { bar: 42 } })
    ).toBeFalsy();
  });

  it('should not deep match object like values', () => {
    class Foo {
      foo = 'bar';
    }
    expect(isObject({ foo: 'bar' }).matches(new Foo())).toBeFalsy();
    expect(isObject({ 0: 1 }).matches([1])).toBeFalsy();
  });

  it('should deep match nested objects with arrays', () => {
    expect(
      isObject({ foo: [1, 2, 3] }).matches({
        foo: [1, 2, 3],
      })
    ).toBeTruthy();

    expect(
      isObject({ foo: [1, 2] }).matches({
        foo: [1, 2, 3],
      })
    ).toBeFalsy();

    expect(
      isObject({ foo: [1, 2] }).matches({
        foo: [2, 3],
      })
    ).toBeFalsy();
  });

  it('should deep match nested objects with sets', () => {
    expect(
      isObject({ foo: new Set([1, 2, 3]) }).matches({
        foo: new Set([1, 2, 3]),
      })
    ).toBeTruthy();

    expect(
      isObject({ foo: new Set([1, 2]) }).matches({
        foo: new Set([1, 2, 3]),
      })
    ).toBeFalsy();

    expect(
      isObject({ foo: new Set([1, 2]) }).matches({
        foo: new Set([1]),
      })
    ).toBeFalsy();
  });

  it('should deep match nested objects with maps', () => {
    expect(
      isObject({
        foo: new Map([
          [1, 2],
          [3, 4],
        ]),
      }).matches({
        foo: new Map([
          [1, 2],
          [3, 4],
        ]),
      })
    ).toBeTruthy();

    expect(
      isObject({ foo: new Map([[1, 2]]) }).matches({
        foo: new Map([
          [1, 2],
          [3, 4],
        ]),
      })
    ).toBeFalsy();

    expect(
      isObject({ foo: new Map([[1, 2]]) }).matches({
        foo: new Map([[1, 3]]),
      })
    ).toBeFalsy();
  });

  it('should match against extra undefined keys', () => {
    expect(isObject({}).matches({ key: undefined })).toBeTruthy();
  });

  it('should not match if undefined keys are missing', () => {
    expect(isObject({ key: undefined }).matches({})).toBeFalsy();
  });

  it('should match nested matchers', () => {
    expect(isObject({ foo: isString() }).matches({ foo: 'bar' })).toBeTruthy();
    expect(
      isObject({ foo: isArray([isString()]) }).matches({
        foo: ['bar'],
      })
    ).toBeTruthy();
    expect(isObject({ foo: isString() }).matches({ foo: 23 })).toBeFalsy();
  });

  it('should handle non string keys when matching nested matchers', () => {
    const matcher = matches(() => false, {
      getDiff: () => ({ actual: 'a', expected: 'e' }),
    });
    const foo = Symbol('foo');

    expect(
      isObject({ [foo]: matcher }).matches({ [foo]: 'actual' })
    ).toBeFalsy();
  });

  describe('print', () => {
    it('should pretty print when no partial', () => {
      expectAnsilessEqual(isObject().toString(), `Matcher<object>`);
    });

    it('should pretty print the partial object', () => {
      expectAnsilessEqual(
        isObject({ foo: 'bar' }).toString(),
        `Matcher<object>({"foo": "bar"})`
      );
    });

    it('should pretty print the partial object when it contains matchers', () => {
      expectAnsilessEqual(
        isObject({
          foo: matches(() => false, { toString: () => 'matcher' }),
        }).toString(),
        `Matcher<object>({"foo": "matcher"})`
      );
    });
  });

  describe('diff', () => {
    it('should handle non objects', () => {
      expect(isObject().getDiff('not object')).toEqual({
        expected: 'Matcher<object>',
        actual: '"not object" (not object)',
      });

      expect(isObject().getDiff([1, 2, 3])).toEqual({
        expected: 'Matcher<object>',
        actual: '[1, 2, 3] (not object)',
      });

      expect(isObject({ foo: 'bar' }).getDiff('not object')).toEqual({
        expected: { foo: 'bar' },
        actual: 'not object',
      });

      expect(
        isObject({ foo: { bar: 'baz' } }).getDiff({ foo: 'not object' })
      ).toEqual({
        expected: { foo: { bar: 'baz' } },
        actual: { foo: 'not object' },
      });

      expect(isObject({ foo: 'bar' }).getDiff({ foo: [1, 2, 3] })).toEqual({
        expected: { foo: 'bar' },
        actual: { foo: [1, 2, 3] },
      });

      expect(
        isObject({ foo: { bar: 'baz' } }).getDiff({ foo: undefined })
      ).toEqual({
        expected: { foo: { bar: 'baz' } },
        actual: { foo: undefined },
      });
    });

    it('should handle objects', () => {
      expect(isObject({ foo: 'bar' }).getDiff({ foo: 'baz' })).toEqual({
        actual: { foo: 'baz' },
        expected: { foo: 'bar' },
      });

      expect(isObject({ foo: [1, 2] }).getDiff({ foo: [3, 4] })).toEqual({
        actual: { foo: [3, 4] },
        expected: { foo: [1, 2] },
      });
    });

    it('should collect diffs from nested matchers', () => {
      const matcher = matches(() => false, {
        getDiff: () => ({ actual: 'a', expected: 'e' }),
      });

      expect(isObject({ foo: matcher }).getDiff({ foo: 'actual' })).toEqual({
        actual: { foo: 'a' },
        expected: { foo: 'e' },
      });

      expect(
        isObject({ foo: { bar: matcher } }).getDiff({
          foo: { bar: 'actual' },
        })
      ).toEqual({
        actual: { foo: { bar: 'a' } },
        expected: { foo: { bar: 'e' } },
      });

      expect(
        isObject({ foo: { bar: matcher } }).getDiff({
          foo: undefined,
        })
      ).toEqual({
        actual: { foo: undefined },
        expected: { foo: { bar: 'e' } },
      });
    });

    it('should handle missing keys', () => {
      const matcher = matches(() => false, {
        getDiff: () => ({ actual: 'a', expected: 'e' }),
      });

      expect(isObject({ foo: 'bar' }).getDiff({})).toEqual({
        actual: {},
        expected: { foo: 'bar' },
      });

      expect(isObject({ foo: { bar: 'baz' } }).getDiff({})).toEqual({
        actual: {},
        expected: { foo: { bar: 'baz' } },
      });

      expect(isObject({ foo: matcher }).getDiff({})).toEqual({
        actual: {},
        expected: { foo: 'e' },
      });

      expect(isObject({ foo: { bar: matcher } }).getDiff({})).toEqual({
        actual: {},
        expected: { foo: { bar: 'e' } },
      });
    });

    it('should handle non string keys', () => {
      const matcher = matches(() => false, {
        getDiff: () => ({ actual: 'a', expected: 'e' }),
      });
      const foo = Symbol('foo');

      expect(isObject({ [foo]: matcher }).getDiff({ [foo]: 'actual' })).toEqual(
        {
          actual: { [foo]: 'a' },
          expected: { [foo]: 'e' },
        }
      );
    });
  });
});
