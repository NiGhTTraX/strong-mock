import { expectAnsilessEqual } from '../../tests/ansiless';
import { It } from './it';

describe('It', () => {
  describe('deepEquals', () => {
    it('should match primitives', () => {
      expect(It.deepEquals(1).matches(1)).toBeTruthy();
      expect(It.deepEquals(1).matches(2)).toBeFalsy();

      expect(It.deepEquals(1.0).matches(1.0)).toBeTruthy();
      expect(It.deepEquals(1.0).matches(1.1)).toBeFalsy();

      expect(It.deepEquals(true).matches(true)).toBeTruthy();
      expect(It.deepEquals(true).matches(false)).toBeFalsy();

      expect(It.deepEquals('a').matches('a')).toBeTruthy();
      expect(It.deepEquals('a').matches('b')).toBeFalsy();
    });

    it('should match arrays', () => {
      expect(It.deepEquals([1, 2, 3]).matches([1, 2, 3])).toBeTruthy();
      expect(It.deepEquals([1, 2, 3]).matches([1, 2, 4])).toBeFalsy();
      expect(It.deepEquals([1, 2, 3]).matches([2, 3])).toBeFalsy();
    });

    it('should match objects', () => {
      expect(
        It.deepEquals({ foo: 'bar' }).matches({ foo: 'bar' })
      ).toBeTruthy();
      expect(It.deepEquals({ foo: 'bar' }).matches({ foo: 'baz' })).toBeFalsy();
      expect(It.deepEquals({ foo: 'bar' }).matches({})).toBeFalsy();
      expect(It.deepEquals({}).matches({ foo: 'bar' })).toBeFalsy();
    });

    it('should match arrays with objects', () => {
      expect(
        It.deepEquals([{ foo: 1 }, { foo: 2 }]).matches([
          { foo: 1 },
          { foo: 2 },
        ])
      ).toBeTruthy();
      expect(
        It.deepEquals([{ foo: 1 }, { foo: 2 }]).matches([
          { foo: 1 },
          { foo: 3 },
        ])
      ).toBeFalsy();
    });

    it('should match nested objects', () => {
      expect(
        It.deepEquals({ foo: { bar: 'baz' } }).matches({ foo: { bar: 'baz' } })
      ).toBeTruthy();
      expect(
        It.deepEquals({ foo: { bar: 'baz' } }).matches({ foo: { bar: 'boo' } })
      ).toBeFalsy();
    });

    it('should not match objects with missing optional keys', () => {
      expect(It.deepEquals({}).matches({ key: undefined })).toBeFalsy();
      expect(It.deepEquals({ key: undefined }).matches({})).toBeFalsy();
    });

    it('should match objects with symbol keys', () => {
      const foo = Symbol('foo');

      expect(
        It.deepEquals({ [foo]: true }).matches({ [foo]: true })
      ).toBeTruthy();
      expect(
        It.deepEquals({ [foo]: true }).matches({ [foo]: false })
      ).toBeFalsy();

      expect(It.deepEquals({ [foo]: true }).matches({})).toBeFalsy();
      expect(It.deepEquals({}).matches({ [foo]: false })).toBeFalsy();
    });

    it('should match instances of the same class', () => {
      class Foo {
        bar = 42;
      }

      expect(It.deepEquals(new Foo()).matches(new Foo())).toBeTruthy();
    });

    it('should not match objects with different prototypes', () => {
      class Foo {
        bar = 42;
      }

      class Bar {
        bar = 42;
      }

      expect(It.deepEquals(new Foo()).matches(new Bar())).toBeFalsy();
      expect(It.deepEquals(new Foo()).matches({ bar: 42 })).toBeFalsy();
    });

    it('should match sets', () => {
      expect(
        It.deepEquals(new Set([1, 2, 3])).matches(new Set([1, 2, 3]))
      ).toBeTruthy();
      expect(
        It.deepEquals(new Set([1, 2, 3])).matches(new Set([2, 3]))
      ).toBeFalsy();
      expect(
        It.deepEquals(new Set([1, 2, 3])).matches(new Set([1, 2, 4]))
      ).toBeFalsy();
    });

    it('should match maps', () => {
      expect(
        It.deepEquals(new Map([[1, 2]])).matches(new Map([[1, 2]]))
      ).toBeTruthy();
      expect(
        It.deepEquals(new Map([[1, 2]])).matches(new Map([[1, 3]]))
      ).toBeFalsy();
      expect(It.deepEquals(new Map([[1, 2]])).matches(new Map([]))).toBeFalsy();
    });

    it('should match dates', () => {
      expect(
        It.deepEquals(new Date(1000)).matches(new Date(1000))
      ).toBeTruthy();
      expect(It.deepEquals(new Date(1000)).matches(new Date(1001))).toBeFalsy();
    });

    it('should match buffers', () => {
      expect(
        It.deepEquals(Buffer.from('abc')).matches(Buffer.from('abc'))
      ).toBeTruthy();
      expect(
        It.deepEquals(Buffer.from('abc')).matches(Buffer.from('abd'))
      ).toBeFalsy();
    });

    it('should not match arrays with missing indices', () => {
      expect(It.deepEquals([1, 2, 3]).matches([1, undefined, 3])).toBeFalsy();
      expect(It.deepEquals([1, undefined, 3]).matches([1, 2, 3])).toBeFalsy();
    });

    it('should not match sparse arrays with missing indices', () => {
      const a = [1, 2, 3];
      const b = [1];
      b[2] = 3;

      expect(It.deepEquals(a).matches(b)).toBeFalsy();
      expect(It.deepEquals(b).matches(a)).toBeFalsy();
    });

    describe('non-strict', () => {
      const options = { strict: false };

      it('should match primitives', () => {
        expect(It.deepEquals(1, options).matches(1)).toBeTruthy();
        expect(It.deepEquals(1, options).matches(2)).toBeFalsy();

        expect(It.deepEquals(1.0, options).matches(1.0)).toBeTruthy();
        expect(It.deepEquals(1.0, options).matches(1.1)).toBeFalsy();

        expect(It.deepEquals(true, options).matches(true)).toBeTruthy();
        expect(It.deepEquals(true, options).matches(false)).toBeFalsy();

        expect(It.deepEquals('a', options).matches('a')).toBeTruthy();
        expect(It.deepEquals('a', options).matches('b')).toBeFalsy();
      });

      it('should match arrays', () => {
        expect(
          It.deepEquals([1, 2, 3], options).matches([1, 2, 3])
        ).toBeTruthy();
        expect(
          It.deepEquals([1, 2, 3], options).matches([1, 2, 4])
        ).toBeFalsy();
        expect(It.deepEquals([1, 2, 3], options).matches([2, 3])).toBeFalsy();
      });

      it('should match objects', () => {
        expect(
          It.deepEquals({ foo: 'bar' }, options).matches({ foo: 'bar' })
        ).toBeTruthy();
        expect(
          It.deepEquals({ foo: 'bar' }, options).matches({ foo: 'baz' })
        ).toBeFalsy();
        expect(It.deepEquals({ foo: 'bar' }, options).matches({})).toBeFalsy();
        expect(It.deepEquals({}, options).matches({ foo: 'bar' })).toBeFalsy();
      });

      it('should match arrays with objects', () => {
        expect(
          It.deepEquals([{ foo: 1 }, { foo: 2 }], options).matches([
            { foo: 1 },
            { foo: 2 },
          ])
        ).toBeTruthy();
        expect(
          It.deepEquals([{ foo: 1 }, { foo: 2 }], options).matches([
            { foo: 1 },
            { foo: 3 },
          ])
        ).toBeFalsy();
      });

      it('should match objects with missing optional keys', () => {
        expect(
          It.deepEquals({}, options).matches({ key: undefined })
        ).toBeTruthy();
        expect(
          It.deepEquals({ key: undefined }, options).matches({})
        ).toBeTruthy();
      });

      it('should match instances of the same class', () => {
        class Foo {
          bar = 42;
        }

        expect(
          It.deepEquals(new Foo(), options).matches(new Foo())
        ).toBeTruthy();
      });

      it('should match objects with different prototypes', () => {
        class Foo {
          bar = 42;
        }

        class Bar {
          bar = 42;
        }

        expect(
          It.deepEquals(new Foo(), options).matches(new Bar())
        ).toBeTruthy();
        expect(
          It.deepEquals(new Foo(), options).matches({ bar: 42 })
        ).toBeTruthy();
      });

      it('should not match arrays with missing indices', () => {
        expect(
          It.deepEquals([1, 2, 3], options).matches([1, undefined, 3])
        ).toBeFalsy();
        expect(
          It.deepEquals([1, undefined, 3], options).matches([1, 2, 3])
        ).toBeFalsy();
      });

      it('should not match sparse arrays with missing indices', () => {
        const a = [1, 2, 3];
        const b = [1];
        b[2] = 3;

        expect(It.deepEquals(a, options).matches(b)).toBeFalsy();
        expect(It.deepEquals(b, options).matches(a)).toBeFalsy();
      });
    });

    it('should pretty print', () => {
      expectAnsilessEqual(It.deepEquals(23).toJSON(), '23');
      expectAnsilessEqual(
        It.deepEquals({ foo: { bar: [1, 2, 3] } }).toJSON(),
        '{"foo": {"bar": [1, 2, 3]}}'
      );
    });
  });

  describe('is', () => {
    it('should compare primitives', () => {
      expect(It.is(42).matches(42)).toBeTruthy();
      expect(It.is(42).matches(0)).toBeFalsy();
      expect(It.is('foo').matches('foo')).toBeTruthy();
      expect(It.is('foo').matches('bar')).toBeFalsy();
      expect(It.is(true).matches(true)).toBeTruthy();
      expect(It.is(true).matches(false)).toBeFalsy();
    });

    it('should compare arrays by reference', () => {
      const arr = [1, 2, 3];
      expect(It.is(arr).matches(arr)).toBeTruthy();
      expect(It.is(arr).matches([1, 2, 3])).toBeFalsy();
    });

    it('should compare objects by reference', () => {
      const obj = { foo: 'bar' };
      expect(It.is(obj).matches(obj)).toBeTruthy();
      expect(It.is(obj).matches({ foo: 'bar' })).toBeFalsy();
    });

    it('should compare +0 and -0', () => {
      expect(It.is(+0).matches(-0)).toBeFalsy();
      expect(It.is(-0).matches(-0)).toBeTruthy();
    });

    it('should compare NaN', () => {
      expect(It.is(NaN).matches(0 / 0)).toBeTruthy();
      expect(It.is(NaN).matches(Number.NaN)).toBeTruthy();
    });

    it('should pretty print', () => {
      expectAnsilessEqual(It.is(23).toJSON(), '23');
      expectAnsilessEqual(
        It.is({ foo: { bar: [1, 2, 3] } }).toJSON(),
        '{"foo": {"bar": [1, 2, 3]}}'
      );
    });
  });

  describe('isAny', () => {
    it('should match null', () => {
      expect(It.isAny().matches(null)).toBeTruthy();
    });

    it('should match undefined', () => {
      expect(It.isAny().matches(undefined)).toBeTruthy();
    });

    it('should match strings', () => {
      expect(It.isAny().matches('foobar')).toBeTruthy();
    });

    it('should match numbers', () => {
      expect(It.isAny().matches(23)).toBeTruthy();
    });

    it('should match booleans', () => {
      expect(It.isAny().matches(true)).toBeTruthy();
    });

    it('should match objects', () => {
      expect(It.isAny().matches({ foo: 'bar' })).toBeTruthy();
    });

    it('should match arrays', () => {
      expect(It.isAny().matches([1, 2, 3])).toBeTruthy();
    });

    it('should pretty print', () => {
      expect(It.isAny().toJSON()).toEqual('anything');
    });
  });

  describe('isNumber', () => {
    it('should match 0', () => {
      expect(It.isNumber().matches(0)).toBeTruthy();
    });

    it('should match positive integers', () => {
      expect(It.isNumber().matches(23)).toBeTruthy();
    });

    it('should match negative integers', () => {
      expect(It.isNumber().matches(-23)).toBeTruthy();
    });

    it('should match positive floats', () => {
      expect(It.isNumber().matches(10.5)).toBeTruthy();
    });

    it('should match negative floats', () => {
      expect(It.isNumber().matches(-10.5)).toBeTruthy();
    });

    it('should math positive scientific notation', () => {
      expect(It.isNumber().matches(10e2)).toBeTruthy();
    });

    it('should math negative scientific notation', () => {
      expect(It.isNumber().matches(-10e2)).toBeTruthy();
    });

    it('should not match strings', () => {
      expect(It.isNumber().matches('foo')).toBeFalsy();
    });

    it('should not match strings numbers', () => {
      expect(It.isNumber().matches('10')).toBeFalsy();
    });

    it('should not match strings containing numbers', () => {
      expect(It.isNumber().matches('10foo')).toBeFalsy();
    });

    it('should not match NaN', () => {
      expect(It.isNumber().matches(NaN)).toBeFalsy();
    });

    it('should pretty print', () => {
      expect(It.isNumber().toJSON()).toEqual('number');
    });
  });

  describe('isString', () => {
    it('should match any string', () => {
      expect(It.isString().matches('foobar')).toBeTruthy();
    });

    it('should match the empty string', () => {
      expect(It.isString().matches('')).toBeTruthy();
    });

    it('should not match numbers', () => {
      expect(It.isString().matches(10e2)).toBeFalsy();
    });

    it('should match a string based on the given pattern', () => {
      expect(It.isString({ matching: /foo/ }).matches('foo')).toBeTruthy();
      expect(It.isString({ matching: /foo/ }).matches('bar')).toBeFalsy();
    });

    it('should match a string containing the given substring', () => {
      expect(It.isString({ containing: 'foo' }).matches('foobar')).toBeTruthy();
      expect(It.isString({ containing: 'baz' }).matches('foobar')).toBeFalsy();
    });

    it('should throw if more than one pattern given', () => {
      expect(() =>
        It.isString({ matching: /foo/, containing: 'bar' })
      ).toThrow();
    });

    it('should pretty print', () => {
      expectAnsilessEqual(It.isString().toJSON(), 'string');
      expectAnsilessEqual(
        It.isString({ containing: 'foo' }).toJSON(),
        "string('foo')"
      );
      expectAnsilessEqual(
        It.isString({ matching: /bar/ }).toJSON(),
        'string(/bar/)'
      );
    });

    it("should print diff when there's a match", () => {
      expect(It.isString().getDiff('foo')).toEqual({
        actual: 'foo',
        expected: 'foo',
      });

      expect(It.isString({ containing: 'foo' }).getDiff('foobar')).toEqual({
        actual: 'foobar',
        expected: 'foobar',
      });

      expect(It.isString({ matching: /foo/ }).getDiff('foobar')).toEqual({
        actual: 'foobar',
        expected: 'foobar',
      });
    });

    it("should print diff when there's a mismatch", () => {
      expect(It.isString().getDiff(42)).toEqual({
        actual: '42 (number)',
        expected: 'string',
      });

      expect(It.isString({ containing: 'foo' }).getDiff(42)).toEqual({
        actual: '42 (number)',
        expected: 'string',
      });

      expect(It.isString({ containing: 'foo' }).getDiff('bar')).toEqual({
        actual: 'bar',
        expected: "string containing 'foo'",
      });

      expect(It.isString({ matching: /foo/ }).getDiff('bar')).toEqual({
        actual: 'bar',
        expected: 'string matching /foo/',
      });
    });
  });

  describe('isArray', () => {
    it('should match an empty array', () => {
      expect(It.isArray().matches([])).toBeTruthy();
    });

    it('should not match array likes', () => {
      expect(It.isArray().matches({ length: 0 })).toBeFalsy();
      expect(It.isArray().matches(new Set([1, 2, 3]))).toBeFalsy();
    });

    it('should match a non-empty array', () => {
      expect(It.isArray().matches([1, '2', true, {}])).toBeTruthy();
    });

    it('should match an array containing an empty array', () => {
      expect(It.isArray([]).matches([1, '2', true, {}])).toBeTruthy();
      expect(It.isArray([]).matches([])).toBeTruthy();
    });

    it('should match arrays that include the given sub-array', () => {
      expect(It.isArray([2, 3]).matches([1, 2, 3, 4])).toBeTruthy();
      expect(It.isArray([2, 3]).matches([3, 4])).toBeFalsy();
      expect(It.isArray([1, 2]).matches([1, 2, 3, 4])).toBeTruthy();
      expect(It.isArray([1, 2]).matches([2])).toBeFalsy();
      expect(It.isArray([3, 4]).matches([1, 2, 3, 4])).toBeTruthy();
      expect(It.isArray([1, 2, 3, 4]).matches([1, 2, 3, 4])).toBeTruthy();
    });

    it('should match arrays that includes all elements in the given array, in any order', () => {
      expect(It.isArray([1, 2, 3]).matches([3, 2, 1])).toBeTruthy();
      expect(It.isArray([3, 2, 1]).matches([1, 1, 2, 2, 3, 3])).toBeTruthy();
    });

    it('should match arrays of objects', () => {
      expect(
        It.isArray([{ foo: 'bar' }]).matches([{ foo: 'bar' }, { foo: 'baz' }])
      ).toBeTruthy();
      expect(
        It.isArray([{ foo: 'boo' }]).matches([{ foo: 'bar' }, { foo: 'baz' }])
      ).toBeFalsy();
    });

    it('should match nested matchers', () => {
      expect(
        It.isArray([It.isString(), It.isObject({ foo: 'bar' })]).matches([
          'foo',
          { foo: 'bar' },
        ])
      ).toBeTruthy();
      expect(
        It.isArray([It.isString({ containing: 'foobar' })]).matches(['foo'])
      ).toBeFalsy();
    });

    it('should pretty print', () => {
      expectAnsilessEqual(It.isArray().toJSON(), 'array');
      expectAnsilessEqual(It.isArray([1, 2, 3]).toJSON(), 'array([1, 2, 3])');
    });
  });

  describe('matches', () => {
    it('should support custom predicates', () => {
      expect(It.matches(() => true).matches(':irrelevant:')).toBeTruthy();
      expect(It.matches(() => false).matches(':irrelevant:')).toBeFalsy();
      expect(It.matches((arg) => !!arg).matches(true)).toBeTruthy();
      expect(It.matches((arg) => !!arg).matches(false)).toBeFalsy();
    });

    it('should pretty print', () => {
      expect(It.matches(() => true).toJSON()).toEqual('matches(() => true)');
    });

    it('should pretty print with custom message', () => {
      expect(
        It.matches(() => true, { toJSON: () => 'foobar' }).toJSON()
      ).toEqual('foobar');
    });

    it('should call getDiff if the matcher fails', () => {
      const matcher = It.matches(() => false, {
        getDiff: () => ({ actual: 'a', expected: 'e' }),
      });

      expect(matcher.getDiff(42)).toEqual({ actual: 'a', expected: 'e' });
    });

    it('should call getDiff if the matcher succeeds', () => {
      const matcher = It.matches(() => true, {
        getDiff: () => ({ actual: 'a', expected: 'e' }),
      });

      expect(matcher.getDiff(42)).toEqual({ actual: 'a', expected: 'e' });
    });

    it('should use toJSON as the default getDiff', () => {
      const matcher = It.matches(() => false, { toJSON: () => 'foobar' });

      expect(matcher.getDiff(42)).toEqual({ actual: 42, expected: 'foobar' });
    });
  });

  describe('isObject', () => {
    it('should match any object with empty object', () => {
      expect(
        It.isObject().matches({
          foo: 'bar',
        })
      ).toBeTruthy();
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

    it('should pretty print', () => {
      expectAnsilessEqual(It.isObject().toJSON(), `object`);
    });

    it('should pretty print the partial object', () => {
      expectAnsilessEqual(
        It.isObject({ foo: 'bar' }).toJSON(),
        `object({"foo": "bar"})`
      );
    });
  });

  describe('willCapture', () => {
    it('should match anything', () => {
      const matcher = It.willCapture();

      expect(matcher.matches(23)).toBeTruthy();
      expect(matcher.matches(0)).toBeTruthy();
      expect(matcher.matches(null)).toBeTruthy();
      expect(matcher.matches(undefined)).toBeTruthy();
      expect(matcher.matches('')).toBeTruthy();
    });

    it('should store the incoming argument', () => {
      const matcher = It.willCapture<number>();

      expect(matcher.value).toBeUndefined();

      expect(matcher.matches(23)).toBeTruthy();

      expect(matcher.value).toEqual(23);
    });

    it('should store the incoming argument per matcher', () => {
      const matcher1 = It.willCapture<number>();
      const matcher2 = It.willCapture<number>();

      matcher1.matches(1);
      matcher2.matches(2);

      expect(matcher1.value).toEqual(1);
      expect(matcher2.value).toEqual(2);
    });

    it('should pretty print', () => {
      expect(It.willCapture().toJSON()).toEqual('captures');
      expect(It.willCapture('custom').toJSON()).toEqual('custom');
    });

    it('should print diff', () => {
      expect(It.willCapture().getDiff('foo')).toEqual({
        actual: 'foo',
        expected: 'foo',
      });

      expect(It.willCapture('captor').getDiff('foo')).toEqual({
        actual: 'foo',
        expected: 'foo',
      });
    });
  });
});
