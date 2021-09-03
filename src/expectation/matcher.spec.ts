import { expect } from 'tdd-buffet/expect/jest';
import { describe, it } from 'tdd-buffet/suite/node';
import { deepEquals, It } from './matcher';
import { expectAnsilessEqual } from '../../tests/ansiless';

describe('It', () => {
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

    it('should match nested objects', () => {
      expect(
        deepEquals({ foo: { bar: 'baz' } }).matches({ foo: { bar: 'baz' } })
      ).toBeTruthy();
      expect(
        deepEquals({ foo: { bar: 'baz' } }).matches({ foo: { bar: 'boo' } })
      ).toBeFalsy();
    });

    it('should not match objects with missing optional keys', () => {
      expect(deepEquals({}).matches({ key: undefined })).toBeFalsy();
      expect(deepEquals({ key: undefined }).matches({})).toBeFalsy();
    });

    it('should match sets', () => {
      expect(
        deepEquals(new Set([1, 2, 3])).matches(new Set([1, 2, 3]))
      ).toBeTruthy();
      expect(
        deepEquals(new Set([1, 2, 3])).matches(new Set([2, 3]))
      ).toBeFalsy();
      expect(
        deepEquals(new Set([1, 2, 3])).matches(new Set([1, 2, 4]))
      ).toBeFalsy();
    });

    it('should match maps', () => {
      expect(
        deepEquals(new Map([[1, 2]])).matches(new Map([[1, 2]]))
      ).toBeTruthy();
      expect(
        deepEquals(new Map([[1, 2]])).matches(new Map([[1, 3]]))
      ).toBeFalsy();
      expect(deepEquals(new Map([[1, 2]])).matches(new Map([]))).toBeFalsy();
    });

    it('should match dates', () => {
      expect(deepEquals(new Date(1000)).matches(new Date(1000))).toBeTruthy();
      expect(deepEquals(new Date(1000)).matches(new Date(1001))).toBeFalsy();
    });

    it('should match buffers', () => {
      expect(
        deepEquals(Buffer.from('abc')).matches(Buffer.from('abc'))
      ).toBeTruthy();
      expect(
        deepEquals(Buffer.from('abc')).matches(Buffer.from('abd'))
      ).toBeFalsy();
    });

    it('should pretty print', () => {
      expectAnsilessEqual(deepEquals(23).toJSON(), '23');
      expectAnsilessEqual(
        deepEquals({ foo: { bar: [1, 2, 3] } }).toJSON(),
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

  describe('Capture', () => {
    it('should capture null', () => {
      const capture = new It.Capture();
      expect(capture.capture().matches(null)).toBeTruthy();
      expect(capture.get()).toBe(null);
    });

    it('should capture undefined', () => {
      const capture = new It.Capture();
      expect(capture.capture().matches(undefined)).toBeTruthy();
      expect(capture.get()).toBe(undefined);
    });

    it('should capture strings', () => {
      const capture = new It.Capture<string>();
      expect(capture.capture().matches('foobar')).toBeTruthy();
      expect(capture.get()).toBe('foobar');
    });

    it('should return undefined when not captured', () => {
      const capture = new It.Capture<string>();
      expect(capture.get()).toBe(undefined);
    });

    it('should capture numbers', () => {
      const capture = new It.Capture<number>();
      expect(capture.capture().matches(23)).toBeTruthy();
      expect(capture.get()).toBe(23);
    });

    it('should capture booleans', () => {
      const capture = new It.Capture<boolean>();
      expect(capture.capture().matches(true)).toBeTruthy();
      expect(capture.get()).toBe(true);
    });

    it('should capture objects', () => {
      const capture = new It.Capture<object>();
      expect(capture.capture().matches({ foo: 'bar' })).toBeTruthy();
      expect(capture.get()).toMatchObject({ foo: 'bar' });
    });

    it('should capture arrays', () => {
      const capture = new It.Capture<Array<number>>();
      expect(capture.capture().matches([1, 2, 3])).toBeTruthy();
      expect(capture.get()).toMatchObject([1, 2, 3]);
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
        'string("foo")'
      );
      expectAnsilessEqual(
        It.isString({ matching: /bar/ }).toJSON(),
        'string(/bar/)'
      );
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
});
