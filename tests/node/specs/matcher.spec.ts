import { describe, expect, it } from '../suite';
import { It } from '../../../src/matcher';

describe('Matcher', () => {
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
});
