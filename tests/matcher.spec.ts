import { expect } from 'tdd-buffet/expect/jest';
import { describe, it } from 'tdd-buffet/suite/node';
import { It } from '../src/matcher';
import { expectAnsilessEqual } from './ansiless';

describe('It', () => {
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
