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
