import { describe, expect, it } from 'vitest';
import { expectAnsilessEqual } from '../../tests/ansiless.js';
import { containsObject } from './contains-object.js';
import { deepEquals } from './deep-equals.js';
import { isString } from './is-string.js';
import { matches } from './matcher.js';

describe('deepEquals', () => {
  const passingMatcher = matches<any>(() => true);
  const failingMatcher = matches<any>(() => false, {
    getDiff: () => ({
      actual: 'actual-diff',
      expected: 'expected-diff',
    }),
  });

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

  it('should match root nested matcher', () => {
    expect(deepEquals(passingMatcher).matches('foo')).toBeTruthy();
    expect(deepEquals(failingMatcher).matches('foo')).toBeFalsy();
  });

  it('should match objects with nested matchers', () => {
    expect(
      deepEquals({ foo: passingMatcher }).matches({ foo: 'bar' }),
    ).toBeTruthy();
    expect(
      deepEquals({ foo: failingMatcher }).matches({ foo: 'bar' }),
    ).toBeFalsy();
    expect(
      deepEquals({ foo: passingMatcher, missing: 1 }).matches({ foo: 'bar' }),
    ).toBeFalsy();
    expect(
      deepEquals({ foo: passingMatcher }).matches({ foo: 'bar', extra: 1 }),
    ).toBeFalsy();

    expect(
      deepEquals({ foo: 1, bar: { baz: passingMatcher } }).matches({
        foo: 1,
        bar: { baz: 2 },
      }),
    ).toBeTruthy();
    expect(
      deepEquals({ foo: 1, bar: { baz: failingMatcher } }).matches({
        foo: 1,
        bar: { baz: 2 },
      }),
    ).toBeFalsy();
  });

  it('should match arrays with matchers', () => {
    expect(
      deepEquals(['foo', passingMatcher, 'baz']).matches(['foo', 'bar', 'baz']),
    ).toBeTruthy();
    expect(
      deepEquals(['foo', failingMatcher, 'baz']).matches(['foo', 'bar', 'baz']),
    ).toBeFalsy();
  });

  it('should match Maps with matchers', () => {
    expect(
      deepEquals(
        new Map([
          ['foo', passingMatcher],
          ['baz', 'baz'],
        ]),
      ).matches(
        new Map([
          ['foo', 'bar'],
          ['baz', 'baz'],
        ]),
      ),
    ).toBeTruthy();

    expect(
      deepEquals(
        new Map([
          ['foo', failingMatcher],
          ['baz', 'baz'],
        ]),
      ).matches(
        new Map([
          ['foo', 'bar'],
          ['baz', 'baz'],
        ]),
      ),
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

  it('should match objects with symbol keys and nested matchers', () => {
    const foo = Symbol('foo');

    expect(
      deepEquals({ [foo]: passingMatcher }).matches({ [foo]: true }),
    ).toBeTruthy();
    expect(
      deepEquals({ [foo]: failingMatcher }).matches({ [foo]: false }),
    ).toBeFalsy();
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
    expectAnsilessEqual(
      deepEquals({
        foo: matches(() => false, {
          toString: () => 'something',
        }),
      }).toString(),
      '{"foo": "something"}',
    );
  });

  describe('diff', () => {
    it('should return diff for primitives', () => {
      expect(deepEquals(42).getDiff(23)).toEqual({
        expected: 42,
        actual: 23,
      });

      expect(deepEquals('expected').getDiff('actual')).toEqual({
        expected: 'expected',
        actual: 'actual',
      });
    });

    it('should return diff for arrays of primitives', () => {
      expect(deepEquals(['expected', 'missing']).getDiff(['actual'])).toEqual({
        actual: ['actual'],
        expected: ['expected', 'missing'],
      });

      expect(deepEquals(['expected']).getDiff(['actual', 'extra'])).toEqual({
        actual: ['actual', 'extra'],
        expected: ['expected'],
      });
    });

    it('should return diff for objects with primitives', () => {
      expect(
        deepEquals({ foo: 'expected', missing: 42 }).getDiff({
          foo: 'actual',
          extra: 42,
        }),
      ).toEqual({
        actual: { foo: 'actual', extra: 42 },
        expected: { foo: 'expected', missing: 42 },
      });
    });

    it('should return diff for Maps with primitives', () => {
      expect(
        deepEquals(
          new Map([
            ['equal', 1],
            ['missing', 42],
          ]),
        ).getDiff(
          new Map([
            ['equal', 1],
            ['extra', 42],
          ]),
        ),
      ).toEqual({
        actual: new Map([
          ['equal', 1],
          ['extra', 42],
        ]),
        expected: new Map([
          ['equal', 1],
          ['missing', 42],
        ]),
      });
    });

    it('should return diff for root nested matcher', () => {
      expect(deepEquals(failingMatcher).getDiff('actual')).toEqual({
        expected: 'expected-diff',
        actual: 'actual-diff',
      });

      expect(deepEquals(passingMatcher).getDiff('actual')).toEqual({
        expected: 'actual',
        actual: 'actual',
      });
    });

    it('should return diff for arrays with matchers', () => {
      expect(
        deepEquals([
          'equal-primitive',
          'expected-primitive',
          passingMatcher,
          failingMatcher,
          'missing',
          failingMatcher,
        ]).getDiff([
          'equal-primitive',
          'actual-primitive',
          'expected',
          'actual',
        ]),
      ).toEqual({
        expected: [
          'equal-primitive',
          'expected-primitive',
          'expected',
          'expected-diff',
          'missing',
          'expected-diff',
        ],
        actual: [
          'equal-primitive',
          'actual-primitive',
          'expected',
          'actual-diff',
          undefined,
          'actual-diff',
        ],
      });
    });

    it('should return diff for objects with matchers', () => {
      expect(
        deepEquals({
          equalPrimitive: 'foo',
          expectedPrimitive: 'bar',
          equal: passingMatcher,
          expected: failingMatcher,
          missing: 2,
        }).getDiff({
          equalPrimitive: 'foo',
          expectedPrimitive: 'bar',
          equal: 'expected',
          expected: 'actual',
          extra: 2,
        }),
      ).toEqual({
        expected: {
          equalPrimitive: 'foo',
          expectedPrimitive: 'bar',
          equal: 'expected',
          expected: 'expected-diff',
          missing: 2,
        },
        actual: {
          equalPrimitive: 'foo',
          expectedPrimitive: 'bar',
          equal: 'expected',
          expected: 'actual-diff',
          extra: 2,
        },
      });
    });

    it('should return diff for Maps with matchers', () => {
      expect(
        deepEquals(
          new Map([
            ['equalPrimitive', 'equal'],
            ['expectedPrimitive', 'expected'],
            ['equal', passingMatcher],
            ['expected', failingMatcher],
            ['missing', 'missing'],
          ]),
        ).getDiff(
          new Map([
            ['equalPrimitive', 'equal'],
            ['expectedPrimitive', 'actual'],
            ['equal', 'expected'],
            ['expected', 'actual'],
            ['extra', 'extra'],
          ]),
        ),
      ).toEqual({
        actual: new Map([
          ['equalPrimitive', 'equal'],
          ['expectedPrimitive', 'actual'],
          ['equal', 'expected'],
          ['expected', 'actual-diff'],
          ['extra', 'extra'],
        ]),
        expected: new Map([
          ['equalPrimitive', 'equal'],
          ['expectedPrimitive', 'expected'],
          ['equal', 'expected'],
          ['expected', 'expected-diff'],
          ['missing', 'missing'],
        ]),
      });
    });
  });

  it('e2e', () => {
    expect(
      deepEquals({ foo: { bar: isString('bar') } }).matches({
        foo: { bar: 'foobar' },
      }),
    ).toBeTruthy();

    expect(
      deepEquals({ foo: { bar: isString('baz') } }).getDiff({
        foo: { bar: 'foobar' },
      }),
    ).toEqual({
      expected: { foo: { bar: 'Matcher<string>(baz)' } },
      actual: { foo: { bar: 'foobar' } },
    });

    expect(
      deepEquals([containsObject({ foo: 42 })]).getDiff([
        { foo: 1, extra: 'stuff' },
        { foo: 2, extra: 'stuff' },
      ]),
    ).toEqual({
      expected: [{ foo: 42 }],
      actual: [{ foo: 1 }, { foo: 2, extra: 'stuff' }],
    });
  });
});
