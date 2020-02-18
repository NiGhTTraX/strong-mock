import { expect } from 'tdd-buffet/expect/jest';
import { describe, it } from 'tdd-buffet/suite/node';
import Mock from '../src';
import { UnmetApplyExpectationError } from '../src/errors';

describe('Mock', () => {
  describe('call count', () => {
    describe('always', () => {
      it('function', () => {
        type Foo = () => number;

        const mock = new Mock<Foo>();
        mock
          .when(f => f())
          .returns(1)
          .anyTimes();

        expect(mock.stub()).toEqual(1);
        expect(mock.stub()).toEqual(1);
      });

      it('property', () => {
        interface Foo {
          bar: number;
        }

        const mock = new Mock<Foo>();
        mock
          .when(f => f.bar)
          .returns(1)
          .anyTimes();

        expect(mock.stub.bar).toEqual(1);
        expect(mock.stub.bar).toEqual(1);
      });

      it('method', () => {
        interface Foo {
          bar(x: number): number;
        }

        const mock = new Mock<Foo>();
        mock
          .when(f => f.bar(2))
          .returns(1)
          .anyTimes();

        expect(mock.stub.bar(2)).toEqual(1);
        expect(mock.stub.bar(2)).toEqual(1);
      });
    });

    describe('times', () => {
      describe('exact', () => {
        it('function', () => {
          type Foo = () => number;

          const mock = new Mock<Foo>();
          mock
            .when(f => f())
            .returns(1)
            .times(2);

          expect(mock.stub()).toEqual(1);
          expect(mock.stub()).toEqual(1);
          expect(() => mock.stub()).toThrow();
        });

        it('property', () => {
          interface Foo {
            bar: number;
          }

          const mock = new Mock<Foo>();
          mock
            .when(f => f.bar)
            .returns(1)
            .times(2);

          expect(mock.stub.bar).toEqual(1);
          expect(mock.stub.bar).toEqual(1);
          expect(() => mock.stub.bar).toThrow();
        });

        it('method', () => {
          interface Foo {
            bar(x: number): number;
          }

          const mock = new Mock<Foo>();
          mock
            .when(f => f.bar(2))
            .returns(1)
            .times(2);

          expect(mock.stub.bar(2)).toEqual(1);
          expect(mock.stub.bar(2)).toEqual(1);
          expect(() => mock.stub.bar(2)).toThrow();
        });

        it('unmet', () => {
          const mock = new Mock<() => void>();
          mock
            .when(f => f())
            .returns(undefined)
            .times(2);

          mock.stub();

          expect(() => mock.verifyAll()).toThrow(UnmetApplyExpectationError);
        });
      });

      describe('between', () => {
        it('function', () => {
          type Foo = () => number;

          const mock = new Mock<Foo>();
          mock
            .when(f => f())
            .returns(1)
            .between(2, 3);

          expect(mock.stub()).toEqual(1);
          expect(mock.stub()).toEqual(1);
          expect(mock.stub()).toEqual(1);
          expect(() => mock.stub()).toThrow();
        });

        it('property', () => {
          interface Foo {
            bar: number;
          }

          const mock = new Mock<Foo>();
          mock
            .when(f => f.bar)
            .returns(1)
            .between(2, 3);

          expect(mock.stub.bar).toEqual(1);
          expect(mock.stub.bar).toEqual(1);
          expect(mock.stub.bar).toEqual(1);
          expect(() => mock.stub.bar).toThrow();
        });

        it('method', () => {
          interface Foo {
            bar(x: number): number;
          }

          const mock = new Mock<Foo>();
          mock
            .when(f => f.bar(2))
            .returns(1)
            .between(2, 3);

          expect(mock.stub.bar(2)).toEqual(1);
          expect(mock.stub.bar(2)).toEqual(1);
          expect(mock.stub.bar(2)).toEqual(1);
          expect(() => mock.stub.bar(2)).toThrow();
        });

        it('unmet', () => {
          const mock = new Mock<() => void>();
          mock
            .when(f => f())
            .returns(undefined)
            .between(2, 4);

          mock.stub();

          expect(() => mock.verifyAll()).toThrow(UnmetApplyExpectationError);
        });

        it('multiple', () => {
          type Foo = () => number;

          const mock = new Mock<Foo>();
          mock
            .when(f => f())
            .returns(1)
            .between(1, 2);
          mock
            .when(f => f())
            .returns(2)
            .between(1, 2);

          expect(mock.stub()).toEqual(1);
          expect(mock.stub()).toEqual(1);
          expect(mock.stub()).toEqual(2);
        });
      });
    });

    describe('mixed', () => {
      it('should respect the definition order', () => {
        const mock = new Mock<() => number>();
        mock
          .when(f => f())
          .returns(1)
          .times(1);
        mock
          .when(f => f())
          .returns(2)
          .times(2);
        mock
          .when(f => f())
          .returns(3)
          .between(2, 3);
        mock
          .when(f => f())
          .returns(4)
          .anyTimes();
        mock.when(f => f()).throws('should not reach here');

        expect(mock.stub()).toEqual(1);
        expect(mock.stub()).toEqual(2);
        expect(mock.stub()).toEqual(2);
        expect(mock.stub()).toEqual(3);
        expect(mock.stub()).toEqual(3);
        expect(mock.stub()).toEqual(3);
        expect(mock.stub()).toEqual(4);
      });
    });
  });
});
