import { expect } from 'tdd-buffet/expect/jest';
import { describe, it } from 'tdd-buffet/suite/node';
import {
  UnmetApplyExpectationError,
  UnmetMethodExpectationError,
  UnmetPropertyExpectationError
} from '../src/errors';
import Mock from '../src/mock';

describe('Mock', () => {
  describe('verify', () => {
    it('single method expectation met', () => {
      interface Foo {
        bar(): void;
      }

      const mock = new Mock<Foo>();
      mock.when(f => f.bar()).returns(undefined);
      mock.stub.bar();

      mock.verifyAll();
    });

    it('single property expectation met', () => {
      interface Foo {
        bar: number;
      }

      const mock = new Mock<Foo>();
      mock.when(f => f.bar).returns(23);
      mock.stub.bar;

      mock.verifyAll();
    });

    it('multiple property expectations met', () => {
      interface Foo {
        bar: number;
      }

      const mock = new Mock<Foo>();
      mock.when(f => f.bar).returns(23);
      mock.when(f => f.bar).returns(24);
      mock.stub.bar;
      mock.stub.bar;

      mock.verifyAll();
    });

    it('single function expectation met', () => {
      type Foo = (x: number) => number;

      const mock = new Mock<Foo>();
      mock.when(f => f(42)).returns(23);
      mock.stub(42);

      mock.verifyAll();
    });

    it('single method expectation unmet', () => {
      interface Foo {
        bar(): void;
      }

      const mock = new Mock<Foo>();
      mock.when(f => f.bar()).returns(undefined);

      expect(() => mock.verifyAll()).toThrow(UnmetMethodExpectationError);
    });

    it('single property expectation unmet', () => {
      interface Foo {
        bar: number;
      }

      const mock = new Mock<Foo>();
      mock.when(f => f.bar).returns(23);

      expect(() => mock.verifyAll()).toThrow(UnmetPropertyExpectationError);
    });

    it('multiple property expectations unmet', () => {
      interface Foo {
        bar: number;
      }

      const mock = new Mock<Foo>();
      mock.when(f => f.bar).returns(23);
      mock.when(f => f.bar).returns(24);
      mock.stub.bar;

      expect(() => mock.verifyAll()).toThrow(UnmetPropertyExpectationError);
      expect(() => mock.verifyAll()).toThrow(/24/s);
    });

    it('single function expectation unmet', () => {
      type Foo = (x: number) => number;

      const mock = new Mock<Foo>();
      mock.when(f => f(42)).returns(23);

      expect(() => mock.verifyAll()).toThrow(UnmetApplyExpectationError);
    });

    it('multiple method expectations met', () => {
      interface Foo {
        bar(x: number): void;
      }

      const mock = new Mock<Foo>();
      mock.when(f => f.bar(1)).returns(undefined);
      mock.when(f => f.bar(2)).returns(undefined);
      mock.when(f => f.bar(3)).returns(undefined);
      mock.stub.bar(3);
      mock.stub.bar(2);
      mock.stub.bar(1);

      mock.verifyAll();
    });

    it('multiple method expectations unmet', () => {
      interface Foo {
        bar(x: number): void;
      }

      const mock = new Mock<Foo>();
      mock.when(f => f.bar(1)).returns(undefined);
      mock.when(f => f.bar(2)).returns(undefined);
      mock.when(f => f.bar(3)).returns(undefined);
      mock.stub.bar(2);

      expect(() => mock.verifyAll()).toThrow(UnmetMethodExpectationError);
    });

    it('multiple function expectations met', () => {
      type Foo = (x: number) => undefined;

      const mock = new Mock<Foo>();
      mock.when(f => f(1)).returns(undefined);
      mock.when(f => f(2)).returns(undefined);
      mock.when(f => f(3)).returns(undefined);
      mock.stub(3);
      mock.stub(2);
      mock.stub(1);

      mock.verifyAll();
    });

    it('multiple function expectations unmet', () => {
      type Foo = (x: number) => undefined;

      const mock = new Mock<Foo>();
      mock.when(f => f(1)).returns(undefined);
      mock.when(f => f(2)).returns(undefined);
      mock.when(f => f(3)).returns(undefined);
      mock.stub(2);

      expect(() => mock.verifyAll()).toThrow(UnmetApplyExpectationError);
    });
  });
});
