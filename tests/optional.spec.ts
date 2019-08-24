import { expect } from 'tdd-buffet/suite/expect';
import { describe, it } from 'tdd-buffet/suite/node';
import Mock from '../src/mock';

describe('Mock', () => {
  describe('optional arguments', () => {
    it('optional arg and passed', () => {
      type Foo = (x?: number) => number;

      const mock = new Mock<Foo>();
      mock.when(f => f(1)).returns(2);

      expect(mock.stub(1)).to.equal(2);
    });

    it('optional arg and missing', () => {
      type Foo = (x?: number) => number;

      const mock = new Mock<Foo>();
      mock.when(f => f()).returns(3);

      expect(mock.stub()).to.equal(3);
    });

    it('optional arg and passed undefined', () => {
      type Foo = (x?: number) => number;

      const mock = new Mock<Foo>();
      mock.when(f => f()).returns(4);

      expect(mock.stub(undefined)).to.equal(4);
    });

    it('optional arg and expected undefined and missing', () => {
      type Foo = (x?: number) => number;

      const mock = new Mock<Foo>();
      mock.when(f => f(undefined)).returns(4);

      expect(mock.stub()).to.equal(4);
    });

    it('optional arg and expected undefined and passed undefined', () => {
      type Foo = (x?: number) => number;

      const mock = new Mock<Foo>();
      mock.when(f => f(undefined)).returns(4);

      expect(mock.stub(undefined)).to.equal(4);
    });

    it('option arg not expected but passed', () => {
      type Foo = (x?: number) => number;

      const mock = new Mock<Foo>();
      mock.when(f => f()).returns(2);

      expect(mock.stub(1)).to.equal(2);
    });
  });
});
