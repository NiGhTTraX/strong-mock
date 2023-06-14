import { expectAnsilessEqual } from '../../tests/ansiless';

import { It } from './it';

describe('isObject', () => {
  it('should not match non objects', () => {
    expect(It.isObject().matches('not an object')).toBeFalsy();
    expect(It.isObject().matches([])).toBeFalsy();
    expect(It.isObject().matches(null)).toBeFalsy();
    expect(It.isObject().matches(undefined)).toBeFalsy();
    expect(It.isObject().matches(new (class {})())).toBeFalsy();
  });

  it('should match any object with empty object', () => {
    expect(It.isObject().matches({})).toBeTruthy();
    expect(
      It.isObject().matches({
        foo: 'bar',
      })
    ).toBeTruthy();
  });

  it('should match objects with non string keys', () => {
    const foo = Symbol('foo');

    expect(
      It.isObject({ [foo]: 'bar' }).matches({ [foo]: 'bar' })
    ).toBeTruthy();
    expect(It.isObject({ 100: 'bar' }).matches({ 100: 'bar' })).toBeTruthy();

    expect(It.isObject({ [foo]: 'bar' }).matches({ [foo]: 'baz' })).toBeFalsy();
    expect(It.isObject({ 100: 'bar' }).matches({ 100: 'baz' })).toBeFalsy();
    expect(It.isObject({ 100: 'bar' }).matches({ 101: 'bar' })).toBeFalsy();
  });

  it('should deep match nested objects', () => {
    expect(
      It.isObject({ foo: { bar: { baz: 42 } } }).matches({
        foo: { bar: { baz: 42, bazzz: 23 } },
      })
    ).toBeTruthy();

    expect(
      It.isObject({ foo: { bar: { baz: 43 } } }).matches({
        foo: { bar: { baz: 42, bazzz: 23 } },
      })
    ).toBeFalsy();
  });

  it('should not deep match object like values', () => {
    class Foo {
      foo = 'bar';
    }
    expect(It.isObject({ foo: 'bar' }).matches(new Foo())).toBeFalsy();
    expect(It.isObject({ 0: 1 }).matches([1])).toBeFalsy();
  });

  it('should deep match nested objects with arrays', () => {
    expect(
      It.isObject({ foo: [1, 2, 3] }).matches({
        foo: [1, 2, 3],
      })
    ).toBeTruthy();

    expect(
      It.isObject({ foo: [1, 2] }).matches({
        foo: [1, 2, 3],
      })
    ).toBeFalsy();
  });

  it('should match against extra undefined keys', () => {
    expect(It.isObject({}).matches({ key: undefined })).toBeTruthy();
  });

  it('should not match if undefined keys are missing', () => {
    expect(It.isObject({ key: undefined }).matches({})).toBeFalsy();
  });

  it('should match nested matchers', () => {
    expect(
      It.isObject({ foo: It.isString() }).matches({ foo: 'bar' })
    ).toBeTruthy();
    expect(
      It.isObject({ foo: It.isArray([It.isString()]) }).matches({
        foo: ['bar'],
      })
    ).toBeTruthy();
    expect(
      It.isObject({ foo: It.isString() }).matches({ foo: 23 })
    ).toBeFalsy();
  });

  it('should handle non string keys when matching nested matchers', () => {
    const matcher = It.matches(() => false, {
      getDiff: () => ({ actual: 'a', expected: 'e' }),
    });
    const foo = Symbol('foo');

    expect(
      It.isObject({ [foo]: matcher }).matches({ [foo]: 'actual' })
    ).toBeFalsy();
  });

  it('should pretty print', () => {
    expectAnsilessEqual(It.isObject().toJSON(), `object`);
  });

  it('should pretty print the partial object', () => {
    expectAnsilessEqual(
      It.isObject({ foo: 'bar' }).toJSON(),
      `object({"foo": "bar"})`
    );
  });

  it("should return diff when there's a match", () => {
    expect(It.isObject().getDiff({})).toEqual({
      expected: 'object',
      actual: 'object',
    });

    expect(It.isObject().getDiff({ foo: 'bar' })).toEqual({
      actual: 'object',
      expected: 'object',
    });

    expect(It.isObject({ foo: 'bar' }).getDiff({ foo: 'bar' })).toEqual({
      expected: { foo: 'bar' },
      actual: { foo: 'bar' },
    });
  });

  it("should return diff when there's a mismatch", () => {
    expect(It.isObject().getDiff('not object')).toEqual({
      expected: 'object',
      actual: 'not object',
    });

    expect(It.isObject({ foo: 'bar' }).getDiff({ foo: 'baz' })).toEqual({
      actual: { foo: 'baz' },
      expected: { foo: 'bar' },
    });
  });

  it('should collect diffs from nested matchers', () => {
    const matcher = It.matches(() => false, {
      getDiff: () => ({ actual: 'a', expected: 'e' }),
    });

    expect(It.isObject({ foo: matcher }).getDiff({ foo: 'actual' })).toEqual({
      actual: { foo: 'a' },
      expected: { foo: 'e' },
    });

    expect(
      It.isObject({ foo: { bar: matcher } }).getDiff({
        foo: { bar: 'actual' },
      })
    ).toEqual({
      actual: { foo: { bar: 'a' } },
      expected: { foo: { bar: 'e' } },
    });
  });

  it('should handle missing keys when collecting diffs', () => {
    const matcher = It.matches(() => false, {
      getDiff: () => ({ actual: 'a', expected: 'e' }),
    });

    expect(It.isObject({ foo: matcher }).getDiff({})).toEqual({
      actual: { foo: 'a' },
      expected: { foo: 'e' },
    });

    expect(It.isObject({}).getDiff({ foo: 'bar' })).toEqual({
      actual: {},
      expected: {},
    });
  });

  it('should handle non string keys when collecting diffs', () => {
    const matcher = It.matches(() => false, {
      getDiff: () => ({ actual: 'a', expected: 'e' }),
    });
    const foo = Symbol('foo');

    expect(
      It.isObject({ [foo]: matcher }).getDiff({ [foo]: 'actual' })
    ).toEqual({
      actual: { [foo]: 'a' },
      expected: { [foo]: 'e' },
    });
  });
});
