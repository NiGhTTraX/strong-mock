import { describe, expect, it } from '../suite';
import { It } from '../../../src/matcher';

describe('It', () => {
  describe('isAnyNumber', () => {
    it('should match 0', () => {
      expect(It.isAnyNumber.matches(0)).to.be.true;
    });

    it('should match positive integers', () => {
      expect(It.isAnyNumber.matches(23)).to.be.true;
    });

    it('should match negative integers', () => {
      expect(It.isAnyNumber.matches(-4)).to.be.true;
    });

    it('should match positive floats', () => {
      expect(It.isAnyNumber.matches(123.45)).to.be.true;
    });

    it('should match negative floats', () => {
      expect(It.isAnyNumber.matches(-123.45)).to.be.true;
    });

    it('should match NaN', () => {
      expect(It.isAnyNumber.matches(NaN)).to.be.true;
    });

    it('should match -0', () => {
      expect(It.isAnyNumber.matches(-0)).to.be.true;
    });

    it('should match +0', () => {
      expect(It.isAnyNumber.matches(+0)).to.be.true;
    });

    it('should not match strings', () => {
      expect(It.isAnyNumber.matches('foobar')).to.be.false;
    });

    it('should not match booleans', () => {
      expect(It.isAnyNumber.matches(true)).to.be.false;
    });

    it('should not match objects', () => {
      expect(It.isAnyNumber.matches({ foo: 'bar' })).to.be.false;
    });

    it('should not match arrays', () => {
      expect(It.isAnyNumber.matches([1, 2, 3])).to.be.false;
    });
  });

  describe('isAnyString', () => {
    it('should match the empty string', () => {
      expect(It.isAnyString.matches('')).to.be.true;
    });

    it('should match a string', () => {
      expect(It.isAnyString.matches('foobar')).to.be.true;
    });

    it('should match a string that looks like a number', () => {
      expect(It.isAnyString.matches('4')).to.be.true;
    });

    it('should not match numbers', () => {
      expect(It.isAnyString.matches(23)).to.be.false;
    });

    it('should not match booleans', () => {
      expect(It.isAnyString.matches(true)).to.be.false;
    });

    it('should not match objects', () => {
      expect(It.isAnyString.matches({ foo: 'bar' })).to.be.false;
    });

    it('should not match arrays', () => {
      expect(It.isAnyString.matches([1, 2, 3])).to.be.false;
    });
  });

  describe('isAny', () => {
    it('should match null', () => {
      expect(It.isAny.matches(null)).to.be.true;
    });

    it('should match undefined', () => {
      expect(It.isAny.matches(undefined)).to.be.true;
    });

    it('should match strings', () => {
      expect(It.isAny.matches('foobar')).to.be.true;
    });

    it('should match numbers', () => {
      expect(It.isAny.matches(23)).to.be.true;
    });

    it('should match booleans', () => {
      expect(It.isAny.matches(true)).to.be.true;
    });

    it('should match objects', () => {
      expect(It.isAny.matches({ foo: 'bar' })).to.be.true;
    });

    it('should match arrays', () => {
      expect(It.isAny.matches([1, 2, 3])).to.be.true;
    });
  });

  describe('matches', () => {
    it('should support custom predicates', () => {
      expect(It.matches(() => true).matches(':irrelevant:')).to.be.true;
      expect(It.matches(() => false).matches(':irrelevant:')).to.be.false;
      expect(It.matches(arg => arg).matches(true)).to.be.true;
      expect(It.matches(arg => arg).matches(false)).to.be.false;
    });
  });
});
