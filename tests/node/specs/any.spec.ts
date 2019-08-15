import { describe, expect, it } from '../suite';
import Mock from '../../../src/mock';
import { It } from '../../../src/matcher';

describe('Mock', () => {
  describe('ignoring arguments', () => {
    describe('methods', () => {
      describe('anyNumber', () => {
        it('single argument', () => {
          interface Foo {
            bar: (x: number) => number;
          }

          const mock = new Mock<Foo>();
          mock.when(f => f.bar(It.isAnyNumber)).returns(42);

          expect(mock.stub.bar(23)).to.equal(42);
        });

        it('multiple arguments', () => {
          interface Foo {
            bar: (x: number, y: number) => number;
          }

          const mock = new Mock<Foo>();
          mock.when(f => f.bar(It.isAnyNumber, It.isAnyNumber)).returns(10);

          expect(mock.stub.bar(1, 2)).to.equal(10);
        });

        it('mixed arguments', () => {
          interface Foo {
            bar: (x: number, y: number, z: number) => number;
          }

          const mock = new Mock<Foo>();
          mock.when(f => f.bar(1, It.isAnyNumber, 3)).returns(99);

          expect(mock.stub.bar(1, 2, 3)).to.equal(99);
        });
      });

      describe('anyString', () => {
        it('single argument', () => {
          interface Foo {
            bar: (x: string) => number;
          }

          const mock = new Mock<Foo>();
          mock.when(f => f.bar(It.isAnyString)).returns(42);

          expect(mock.stub.bar('a')).to.equal(42);
        });

        it('multiple arguments', () => {
          interface Foo {
            bar: (x: string, y: string) => number;
          }

          const mock = new Mock<Foo>();
          mock.when(f => f.bar(It.isAnyString, It.isAnyString)).returns(10);

          expect(mock.stub.bar('b', 'c')).to.equal(10);
        });

        it('mixed arguments', () => {
          interface Foo {
            bar: (x: string, y: string, z: string) => number;
          }

          const mock = new Mock<Foo>();
          mock.when(f => f.bar('a', It.isAnyString, 'c')).returns(99);

          expect(mock.stub.bar('a', 'b', 'c')).to.equal(99);
        });
      });
    });

    describe('functions', () => {
      describe('anyNumber', () => {
        it('single argument', () => {
          type Foo = (x: number) => number;

          const mock = new Mock<Foo>();
          mock.when(f => f(It.isAnyNumber)).returns(42);

          expect(mock.stub(23)).to.equal(42);
        });

        it('multiple arguments', () => {
          type Foo = (x: number, y: number) => number;

          const mock = new Mock<Foo>();
          mock.when(f => f(It.isAnyNumber, It.isAnyNumber)).returns(10);

          expect(mock.stub(1, 2)).to.equal(10);
        });

        it('mixed arguments', () => {
          type Foo = (x: number, y: number, z: number) => number;

          const mock = new Mock<Foo>();
          mock.when(f => f(1, It.isAnyNumber, 3)).returns(99);

          expect(mock.stub(1, 2, 3)).to.equal(99);
        });
      });
    });

    describe('mixed', () => {
      describe('anyNumber', () => {
        it('single argument', () => {
          interface Foo {
            (x: number): number;
            bar: (x: number) => number;
          }

          const mock = new Mock<Foo>();
          mock.when(f => f(It.isAnyNumber)).returns(1);
          mock.when(f => f.bar(It.isAnyNumber)).returns(2);

          expect(mock.stub(1)).to.equal(1);
          expect(mock.stub.bar(2)).to.equal(2);
        });

        it('multiple arguments', () => {
          interface Foo {
            (x: number, y: number): number;
            bar: (x: number, y: number) => number;
          }

          const mock = new Mock<Foo>();
          mock.when(f => f(It.isAnyNumber, It.isAnyNumber)).returns(3);
          mock.when(f => f.bar(It.isAnyNumber, It.isAnyNumber)).returns(4);

          expect(mock.stub(1, 2)).to.equal(3);
          expect(mock.stub.bar(1, 2)).to.equal(4);
        });

        it('mixed arguments', () => {
          interface Foo {
            (x: number, y: number, z: number): number;
            bar: (x: number, y: number, z: number) => number;
          }

          const mock = new Mock<Foo>();
          mock.when(f => f(1, It.isAnyNumber, 3)).returns(5);
          mock.when(f => f.bar(1, It.isAnyNumber, 3)).returns(6);

          expect(mock.stub(1, 2, 3)).to.equal(5);
          expect(mock.stub.bar(1, 2, 3)).to.equal(6);
        });
      });
    });
  });
});
