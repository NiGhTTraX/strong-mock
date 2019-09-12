import { expect } from 'tdd-buffet/expect/chai';
import { describe, it } from 'tdd-buffet/suite/node';
import { UnexpectedAccessError } from '../src/errors';
import Mock from '../src/mock';

describe('Mock', () => {
  describe('property expectations', () => {
    it('primitive', () => {
      interface Foo {
        bar: number;
      }

      const mock = new Mock<Foo>();
      mock.when(f => f.bar).returns(23);

      expect(mock.stub.bar).to.equal(23);
    });

    it('undefined', () => {
      interface Foo {
        bar: undefined;
      }

      const mock = new Mock<Foo>();
      mock.when(f => f.bar).returns(undefined);

      expect(mock.stub.bar).to.be.undefined;
    });

    it('array', () => {
      interface Foo {
        bar: number[];
      }

      const mock = new Mock<Foo>();
      mock.when(f => f.bar).returns([1, 2]);

      expect(mock.stub.bar).to.deep.equal([1, 2]);
    });

    it('function', () => {
      interface Foo {
        bar(x: number): string;
      }

      const mock = new Mock<Foo>();

      mock.when(f => f.bar).returns((x: number) => `${x}`);

      expect(mock.stub.bar(2)).to.equal('2');
    });

    it('multiple expectations', () => {
      interface Foo {
        bar: number;
      }

      const mock = new Mock<Foo>();
      mock.when(f => f.bar).returns(1);
      mock.when(f => f.bar).returns(2);

      expect(mock.stub.bar).to.equal(1);
      expect(mock.stub.bar).to.equal(2);
    });

    it('unexpected', () => {
      interface Foo {
        bar: number;
      }

      const mock = new Mock<Foo>();
      mock.when(f => f.bar).returns(1);
      mock.stub.bar;

      expect(() => mock.stub.bar).to.throw(UnexpectedAccessError);
    });

    it('should shadow method expectations when set first', () => {
      interface Foo {
        bar(): string;
      }

      const mock = new Mock<Foo>();

      mock.when(f => f.bar).returns(() => 'bar');
      mock.when(f => f.bar()).returns('baz');

      expect(mock.stub.bar()).to.equal('bar');
      expect(() => mock.stub.bar()).to.throw(UnexpectedAccessError);
    });

    it('should shadow method expectations when set last', () => {
      interface Foo {
        bar(): string;
      }

      const mock = new Mock<Foo>();

      mock.when(f => f.bar()).returns('baz');
      mock.when(f => f.bar).returns(() => 'bar');

      expect(mock.stub.bar()).to.equal('bar');
      expect(() => mock.stub.bar()).to.throw(UnexpectedAccessError);
    });
  });
});
