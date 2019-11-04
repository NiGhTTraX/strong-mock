import { expect } from 'tdd-buffet/expect/chai';
import { describe, it } from 'tdd-buffet/suite/node';
import Mock from '../src';
import { UnmetApplyExpectationError } from '../src/errors';

describe('Mock', () => {
  describe('call count', () => {
    describe('always', () => {
      it('function', () => {
        type Foo = () => number;

        const mock = new Mock<Foo>();
        mock.when(f => f()).returns(1).always();

        expect(mock.stub()).to.equal(1);
        expect(mock.stub()).to.equal(1);
      });

      it('property', () => {
        interface Foo {
          bar: number;
        }

        const mock = new Mock<Foo>();
        mock.when(f => f.bar).returns(1).always();

        expect(mock.stub.bar).to.equal(1);
        expect(mock.stub.bar).to.equal(1);
      });

      it('method', () => {
        interface Foo {
          bar(x: number): number;
        }

        const mock = new Mock<Foo>();
        mock.when(f => f.bar(2)).returns(1).always();

        expect(mock.stub.bar(2)).to.equal(1);
        expect(mock.stub.bar(2)).to.equal(1);
      });
    });

    describe('times', () => {
      it('function', () => {
        type Foo = () => number;

        const mock = new Mock<Foo>();
        mock.when(f => f()).returns(1).times(2);

        expect(mock.stub()).to.equal(1);
        expect(mock.stub()).to.equal(1);
        expect(() => mock.stub()).to.throw();
      });

      it('property', () => {
        interface Foo {
          bar: number;
        }

        const mock = new Mock<Foo>();
        mock.when(f => f.bar).returns(1).times(2);

        expect(mock.stub.bar).to.equal(1);
        expect(mock.stub.bar).to.equal(1);
        expect(() => mock.stub.bar).to.throw();
      });

      it('method', () => {
        interface Foo {
          bar(x: number): number;
        }

        const mock = new Mock<Foo>();
        mock.when(f => f.bar(2)).returns(1).times(2);

        expect(mock.stub.bar(2)).to.equal(1);
        expect(mock.stub.bar(2)).to.equal(1);
        expect(() => mock.stub.bar(2)).to.throw();
      });
    });

    describe('mixed', () => {
      it('should respect the definition order', () => {
        const mock = new Mock<() => number>();
        mock.when(f => f()).returns(1).times(1);
        mock.when(f => f()).returns(2).times(2);
        mock.when(f => f()).returns(3).always();
        mock.when(f => f()).throws('should not reach here');

        expect(mock.stub()).to.equal(1);
        expect(mock.stub()).to.equal(2);
        expect(mock.stub()).to.equal(2);
        expect(mock.stub()).to.equal(3);
        expect(mock.stub()).to.equal(3);
      });
    });

    describe('unmet', () => {
      const mock = new Mock<() => void>();
      mock.when(f => f()).returns(undefined).times(2);

      mock.stub();

      expect(() => mock.verifyAll()).to.throw(UnmetApplyExpectationError);
    });
  });
});
