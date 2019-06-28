import { describe, expect, it } from '../suite';
import Mock from '../../../src/mock';
import {
  UnmetApplyExpectationError,
  UnmetMethodExpectationError,
  UnmetPropertyExpectationError
} from '../../../src/errors';

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

      expect(() => mock.verifyAll()).to.throw(UnmetMethodExpectationError);
    });

    it('single property expectation unmet', () => {
      interface Foo {
        bar: number;
      }

      const mock = new Mock<Foo>();
      mock.when(f => f.bar).returns(23);

      expect(() => mock.verifyAll()).to.throw(UnmetPropertyExpectationError);
    });

    it('multiple property expectations unmet', () => {
      interface Foo {
        bar: number;
      }

      const mock = new Mock<Foo>();
      mock.when(f => f.bar).returns(23);
      mock.when(f => f.bar).returns(24);
      mock.stub.bar;

      expect(() => mock.verifyAll()).to.throw(UnmetPropertyExpectationError);
      expect(() => mock.verifyAll()).to.throw(/24/s);
    });

    it('single function expectation unmet', () => {
      type Foo = (x: number) => number;

      const mock = new Mock<Foo>();
      mock.when(f => f(42)).returns(23);

      expect(() => mock.verifyAll()).to.throw(UnmetApplyExpectationError);
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

      expect(() => mock.verifyAll()).to.throw(UnmetMethodExpectationError);
      // TODO: I'm accepting duplicating the error message test here
      // because it's a simple way of checking that the right expectation
      // is thrown
      expect(() => mock.verifyAll()).to.throw(/\[ 1 ]/s);
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

      expect(() => mock.verifyAll()).to.throw(UnmetApplyExpectationError);
      // TODO: I'm accepting duplicating the error message test here
      // because it's a simple way of checking that the right expectation
      // is thrown
      expect(() => mock.verifyAll()).to.throw(/\[ 1 ]/s);
    });
  });
});
