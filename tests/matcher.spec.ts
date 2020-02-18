import { expect } from 'tdd-buffet/expect/jest';
import { describe, it } from 'tdd-buffet/suite/node';
import { It } from '../src/matcher';

describe('It', () => {
  describe('isAny', () => {
    it('should match null', () => {
      // TODO: fix types
      expect(It.isAny.matches(null)).toBeTruthy();
    });

    it('should match undefined', () => {
      expect(It.isAny.matches(undefined)).toBeTruthy();
    });

    it('should match strings', () => {
      expect(It.isAny.matches('foobar')).toBeTruthy();
    });

    it('should match numbers', () => {
      expect(It.isAny.matches(23)).toBeTruthy();
    });

    it('should match booleans', () => {
      expect(It.isAny.matches(true)).toBeTruthy();
    });

    it('should match objects', () => {
      expect(It.isAny.matches({ foo: 'bar' })).toBeTruthy();
    });

    it('should match arrays', () => {
      expect(It.isAny.matches([1, 2, 3])).toBeTruthy();
    });
  });

  describe('matches', () => {
    it('should support custom predicates', () => {
      expect(It.matches(() => true).matches(':irrelevant:')).toBeTruthy();
      expect(It.matches(() => false).matches(':irrelevant:')).toBeFalsy();
      expect(It.matches(arg => !!arg).matches(true)).toBeTruthy();
      expect(It.matches(arg => !!arg).matches(false)).toBeFalsy();
    });
  });
});
