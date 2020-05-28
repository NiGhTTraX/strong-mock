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

  describe('isObjectContaining', () => {
    it('should match any object with empty object', () => {
      expect(
        It.isObjectContaining({}).matches({
          foo: 'bar',
        })
      ).toBeTruthy();
    });

    it('should deep match nested objects', () => {
      expect(
        It.isObjectContaining({ foo: { bar: { baz: 42 } } }).matches({
          foo: { bar: { baz: 42, bazzz: 23 } },
        })
      ).toBeTruthy();

      expect(
        It.isObjectContaining({ foo: { bar: { baz: 43 } } }).matches({
          foo: { bar: { baz: 42, bazzz: 23 } },
        })
      ).toBeFalsy();
    });

    it('should pretty print', () => {
      expectAnsilessEqual(
        It.isObjectContaining({ foo: 'bar' }).toJSON(),
        `objectContaining({"foo": "bar"})`
      );
    });
  });
});
