import { expect } from 'tdd-buffet/expect/chai';
import { describe, it } from 'tdd-buffet/suite/node';
import { UnexpectedAccessError, WrongMethodArgsError } from '../src/errors';
import Mock from '../src/mock';

describe('Mock', () => {
  describe('method expectations', () => {
    it('no args and no return', () => {
      interface Foo {
        bar(): void;
      }

      const mock = new Mock<Foo>();
      mock.when(f => f.bar()).returns(undefined);

      expect(mock.stub.bar()).to.be.undefined;
    });

    it('no args and return', () => {
      interface Foo {
        bar(): string;
      }

      const mock = new Mock<Foo>();
      mock.when(f => f.bar()).returns('bar');

      expect(mock.stub.bar()).to.equal('bar');
    });

    it('1 arg and return', () => {
      interface Foo {
        bar(x: string): number;
      }

      const mock = new Mock<Foo>();
      mock.when(f => f.bar('bar')).returns(23);

      expect(mock.stub.bar('bar')).to.equal(23);
    });

    it('2 args and return', () => {
      interface Foo {
        bar(x: string, y: boolean): number;
      }

      const mock = new Mock<Foo>();
      mock.when(f => f.bar('bar', true)).returns(23);

      expect(mock.stub.bar('bar', true)).to.equal(23);
    });

    it('variadic args and return', () => {
      interface Foo {
        bar(...args: number[]): number;
      }

      const mock = new Mock<Foo>();
      mock.when(f => f.bar(1, 2, 3, 4)).returns(23);

      expect(mock.stub.bar(1, 2, 3, 4)).to.equal(23);
    });

    it('multiple expectations with same args', () => {
      interface Foo {
        bar(x: number): number;
      }

      const mock = new Mock<Foo>();
      mock.when(f => f.bar(1)).returns(2);
      mock.when(f => f.bar(1)).returns(3);

      expect(mock.stub.bar(1)).to.equal(2);
      expect(mock.stub.bar(1)).to.equal(3);
    });

    it('should not set an expectation with no return value', () => {
      interface Foo {
        bar(x: number): number;
      }
      const mock = new Mock<Foo>();

      mock.when(f => f.bar(1));
      expect(() => mock.verifyAll()).to.not.throw();

      mock.when(f => f.bar(2)).returns(3);
      expect(mock.stub.bar(2)).to.equal(3);
      expect(() => mock.verifyAll()).to.not.throw();
    });

    it('unexpected call', () => {
      interface Foo {
        bar(): void;
      }

      const mock = new Mock<Foo>();

      expect(() => mock.stub.bar()).to.throw(UnexpectedAccessError);
    });

    it('called with wrong arg', () => {
      interface Foo {
        bar(x: number): void;
      }

      const mock = new Mock<Foo>();
      mock.when(f => f.bar(23)).returns(undefined);

      expect(() => mock.stub.bar(21)).to.throw(WrongMethodArgsError);
    });

    it('called with wrong args', () => {
      interface Foo {
        bar(x: number, y: number): void;
      }

      const mock = new Mock<Foo>();
      mock.when(f => f.bar(1, 2)).returns(undefined);

      expect(() => mock.stub.bar(3, 4)).to.throw(WrongMethodArgsError);
    });

    it('called with less variadic args', () => {
      interface Foo {
        bar(...args: number[]): void;
      }

      const mock = new Mock<Foo>();
      mock.when(f => f.bar(1, 2, 3)).returns(undefined);

      expect(() => mock.stub.bar(1, 2)).to.throw(WrongMethodArgsError);
    });

    it('called with wrong variadic args', () => {
      interface Foo {
        bar(...args: number[]): void;
      }

      const mock = new Mock<Foo>();
      mock.when(f => f.bar(1, 2)).returns(undefined);

      expect(() => mock.stub.bar(3, 4)).to.throw(WrongMethodArgsError);
    });
  });
});
