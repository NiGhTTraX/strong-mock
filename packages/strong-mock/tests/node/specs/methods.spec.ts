import { describe, expect, it } from '../../../../../tests/node/suite';
import Mock from '../../../src';

describe('Mock', () => {
  describe('method expectations', () => {
    it('no args and no return', () => {
      interface Foo {
        bar(): void;
      }

      const mock = new Mock<Foo>();
      mock.when(f => f.bar()).returns(undefined);

      expect(mock.object.bar()).to.be.undefined;
    });

    it('no args and return', () => {
      interface Foo {
        bar(): string;
      }

      const mock = new Mock<Foo>();
      mock.when(f => f.bar()).returns('bar');

      expect(mock.object.bar()).to.equal('bar');
    });

    it('1 arg and return', () => {
      interface Foo {
        bar(x: string): number;
      }

      const mock = new Mock<Foo>();
      mock.when(f => f.bar('bar')).returns(23);

      expect(mock.object.bar('bar')).to.equal(23);
    });

    it('2 args and return', () => {
      interface Foo {
        bar(x: string, y: boolean): number;
      }

      const mock = new Mock<Foo>();
      mock.when(f => f.bar('bar', true)).returns(23);

      expect(mock.object.bar('bar', true)).to.equal(23);
    });

    it('variadic args and return', () => {
      interface Foo {
        bar(...args: number[]): number;
      }

      const mock = new Mock<Foo>();
      mock.when(f => f.bar(1, 2, 3, 4)).returns(23);

      expect(mock.object.bar(1, 2, 3, 4)).to.equal(23);
    });

    it('optional arg and passed', () => {
      interface Foo {
        bar(x?: number): number;
      }

      const mock = new Mock<Foo>();
      mock.when(f => f.bar(1)).returns(2);

      expect(mock.object.bar(1)).to.equal(2);
    });

    it('optional arg and missing', () => {
      interface Foo {
        bar(x?: number): number;
      }

      const mock = new Mock<Foo>();
      mock.when(f => f.bar()).returns(3);

      expect(mock.object.bar()).to.equal(3);
    });

    it('optional arg and passed undefined', () => {
      interface Foo {
        bar(x?: number): number;
      }

      const mock = new Mock<Foo>();
      mock.when(f => f.bar()).returns(4);

      expect(mock.object.bar(undefined)).to.equal(4);
    });

    it('optional arg and expected undefined and missing', () => {
      interface Foo {
        bar(x?: number): number;
      }

      const mock = new Mock<Foo>();
      mock.when(f => f.bar(undefined)).returns(4);

      expect(mock.object.bar()).to.equal(4);
    });

    it('optional arg and expected undefined and passed undefined', () => {
      interface Foo {
        bar(x?: number): number;
      }

      const mock = new Mock<Foo>();
      mock.when(f => f.bar(undefined)).returns(4);

      expect(mock.object.bar(undefined)).to.equal(4);
    });

    it('reset', () => {
      interface Foo {
        bar(x: number): number;
      }
      const mock = new Mock<Foo>();

      mock.when(f => f.bar(1)).returns(2);
      mock.reset();

      expect(() => mock.verifyAll()).to.not.throw();

      mock.when(f => f.bar(3)).returns(4);

      expect(mock.object.bar(3)).to.equal(4);
      expect(() => mock.object.bar(1)).to.throw();
    });
  });
});
