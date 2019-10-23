import { expect } from 'tdd-buffet/expect/chai';
import { describe, it } from 'tdd-buffet/suite/node';
import Mock from '../src';

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
  });
});
