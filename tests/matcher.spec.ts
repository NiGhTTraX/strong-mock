import { It } from '../src/matcher';
import { describe, it } from 'tdd-buffet/suite/node';
import { expect } from 'tdd-buffet/suite/expect';

describe('It', () => {
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
