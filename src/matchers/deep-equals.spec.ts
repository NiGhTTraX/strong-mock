import { describe, expect, it } from 'vitest';
import { expectAnsilessEqual } from '../../tests/ansiless.js';
import { deepEquals } from './deep-equals.js';

describe('deepEquals', () => {
  it('should match primitives', () => {
    expect(deepEquals(1).matches(1)).toBeTruthy();
    expect(deepEquals(1).matches(2)).toBeFalsy();

    expect(deepEquals(1.0).matches(1.0)).toBeTruthy();
    expect(deepEquals(1.0).matches(1.1)).toBeFalsy();

    expect(deepEquals(true).matches(true)).toBeTruthy();
    expect(deepEquals(true).matches(false)).toBeFalsy();

    expect(deepEquals('a').matches('a')).toBeTruthy();
    expect(deepEquals('a').matches('b')).toBeFalsy();
  });

  it('should match arrays', () => {
    expect(deepEquals([1, 2, 3]).matches([1, 2, 3])).toBeTruthy();
    expect(deepEquals([1, 2, 3]).matches([1, 2, 4])).toBeFalsy();
    expect(deepEquals([1, 2, 3]).matches([2, 3])).toBeFalsy();
  });

  it('should match objects', () => {
    expect(deepEquals({ foo: 'bar' }).matches({ foo: 'bar' })).toBeTruthy();
    expect(deepEquals({ foo: 'bar' }).matches({ foo: 'baz' })).toBeFalsy();
    expect(deepEquals({ foo: 'bar' }).matches({})).toBeFalsy();
    expect(deepEquals({}).matches({ foo: 'bar' })).toBeFalsy();
  });

  it('should match arrays with objects', () => {
    expect(
      deepEquals([{ foo: 1 }, { foo: 2 }]).matches([{ foo: 1 }, { foo: 2 }]),
    ).toBeTruthy();
    expect(
      deepEquals([{ foo: 1 }, { foo: 2 }]).matches([{ foo: 1 }, { foo: 3 }]),
    ).toBeFalsy();
  });

  it('should match nested objects', () => {
    expect(
      deepEquals({ foo: { bar: 'baz' } }).matches({ foo: { bar: 'baz' } }),
    ).toBeTruthy();
    expect(
      deepEquals({ foo: { bar: 'baz' } }).matches({ foo: { bar: 'boo' } }),
    ).toBeFalsy();
  });

  it('should not match objects with missing optional keys', () => {
    expect(deepEquals({}).matches({ key: undefined })).toBeFalsy();
    expect(deepEquals({ key: undefined }).matches({})).toBeFalsy();
  });

  it('should match objects with symbol keys', () => {
    const foo = Symbol('foo');

    expect(deepEquals({ [foo]: true }).matches({ [foo]: true })).toBeTruthy();
    expect(deepEquals({ [foo]: true }).matches({ [foo]: false })).toBeFalsy();

    expect(deepEquals({ [foo]: true }).matches({})).toBeFalsy();
    expect(deepEquals({}).matches({ [foo]: false })).toBeFalsy();
  });

  it('should match instances of the same class', () => {
    class Foo {
      bar = 42;
    }

    expect(deepEquals(new Foo()).matches(new Foo())).toBeTruthy();
  });

  it('should not match objects with different prototypes', () => {
    class Foo {
      bar = 42;
    }

    class Bar {
      bar = 42;
    }

    expect(deepEquals(new Foo()).matches(new Bar())).toBeFalsy();
    expect(deepEquals(new Foo()).matches({ bar: 42 })).toBeFalsy();
  });

  it('should match sets', () => {
    expect(
      deepEquals(new Set([1, 2, 3])).matches(new Set([1, 2, 3])),
    ).toBeTruthy();
    expect(deepEquals(new Set([1, 2, 3])).matches(new Set([2, 3]))).toBeFalsy();
    expect(
      deepEquals(new Set([1, 2, 3])).matches(new Set([1, 2, 4])),
    ).toBeFalsy();
  });

  it('should match maps', () => {
    expect(
      deepEquals(new Map([[1, 2]])).matches(new Map([[1, 2]])),
    ).toBeTruthy();
    expect(
      deepEquals(new Map([[1, 2]])).matches(new Map([[1, 3]])),
    ).toBeFalsy();
    expect(deepEquals(new Map([[1, 2]])).matches(new Map([]))).toBeFalsy();
  });

  it('should match dates', () => {
    expect(deepEquals(new Date(1000)).matches(new Date(1000))).toBeTruthy();
    expect(deepEquals(new Date(1000)).matches(new Date(1001))).toBeFalsy();
  });

  it('should match buffers', () => {
    expect(
      deepEquals(Buffer.from('abc')).matches(Buffer.from('abc')),
    ).toBeTruthy();
    expect(
      deepEquals(Buffer.from('abc')).matches(Buffer.from('abd')),
    ).toBeFalsy();
  });

  it('should not match arrays with missing indices', () => {
    expect(deepEquals([1, 2, 3]).matches([1, undefined, 3])).toBeFalsy();
    expect(deepEquals([1, undefined, 3]).matches([1, 2, 3])).toBeFalsy();
  });

  it('should not match sparse arrays with missing indices', () => {
    const a = [1, 2, 3];
    const b = [1];
    b[2] = 3;

    expect(deepEquals(a).matches(b)).toBeFalsy();
    expect(deepEquals(b).matches(a)).toBeFalsy();
  });

  describe('non-strict', () => {
    const options = { strict: false };

    it('should match primitives', () => {
      expect(deepEquals(1, options).matches(1)).toBeTruthy();
      expect(deepEquals(1, options).matches(2)).toBeFalsy();

      expect(deepEquals(1.0, options).matches(1.0)).toBeTruthy();
      expect(deepEquals(1.0, options).matches(1.1)).toBeFalsy();

      expect(deepEquals(true, options).matches(true)).toBeTruthy();
      expect(deepEquals(true, options).matches(false)).toBeFalsy();

      expect(deepEquals('a', options).matches('a')).toBeTruthy();
      expect(deepEquals('a', options).matches('b')).toBeFalsy();
    });

    it('should match arrays', () => {
      expect(deepEquals([1, 2, 3], options).matches([1, 2, 3])).toBeTruthy();
      expect(deepEquals([1, 2, 3], options).matches([1, 2, 4])).toBeFalsy();
      expect(deepEquals([1, 2, 3], options).matches([2, 3])).toBeFalsy();
    });

    it('should match objects', () => {
      expect(
        deepEquals({ foo: 'bar' }, options).matches({ foo: 'bar' }),
      ).toBeTruthy();
      expect(
        deepEquals({ foo: 'bar' }, options).matches({ foo: 'baz' }),
      ).toBeFalsy();
      expect(deepEquals({ foo: 'bar' }, options).matches({})).toBeFalsy();
      expect(deepEquals({}, options).matches({ foo: 'bar' })).toBeFalsy();
    });

    it('should match arrays with objects', () => {
      expect(
        deepEquals([{ foo: 1 }, { foo: 2 }], options).matches([
          { foo: 1 },
          { foo: 2 },
        ]),
      ).toBeTruthy();
      expect(
        deepEquals([{ foo: 1 }, { foo: 2 }], options).matches([
          { foo: 1 },
          { foo: 3 },
        ]),
      ).toBeFalsy();
    });

    it('should match objects with missing optional keys', () => {
      expect(deepEquals({}, options).matches({ key: undefined })).toBeTruthy();
      expect(deepEquals({ key: undefined }, options).matches({})).toBeTruthy();
    });

    it('should match instances of the same class', () => {
      class Foo {
        bar = 42;
      }

      expect(deepEquals(new Foo(), options).matches(new Foo())).toBeTruthy();
    });

    it('should match objects with different prototypes', () => {
      class Foo {
        bar = 42;
      }

      class Bar {
        bar = 42;
      }

      expect(deepEquals(new Foo(), options).matches(new Bar())).toBeTruthy();
      expect(deepEquals(new Foo(), options).matches({ bar: 42 })).toBeTruthy();
    });

    it('should not match arrays with missing indices', () => {
      expect(
        deepEquals([1, 2, 3], options).matches([1, undefined, 3]),
      ).toBeFalsy();
      expect(
        deepEquals([1, undefined, 3], options).matches([1, 2, 3]),
      ).toBeFalsy();
    });

    it('should not match sparse arrays with missing indices', () => {
      const a = [1, 2, 3];
      const b = [1];
      b[2] = 3;

      expect(deepEquals(a, options).matches(b)).toBeFalsy();
      expect(deepEquals(b, options).matches(a)).toBeFalsy();
    });
  });

  it('should pretty print', () => {
    expectAnsilessEqual(deepEquals(23).toString(), '23');
    expectAnsilessEqual(
      deepEquals({ foo: { bar: [1, 2, 3] } }).toString(),
      '{"foo": {"bar": [1, 2, 3]}}',
    );
  });

  it('should return diff', () => {
    expect(deepEquals(1).getDiff(2)).toEqual({
      actual: 2,
      expected: 1,
    });

    expect(deepEquals({ foo: 'bar' }).getDiff({ foo: 'baz' })).toEqual({
      actual: { foo: 'baz' },
      expected: { foo: 'bar' },
    });
  });
});
