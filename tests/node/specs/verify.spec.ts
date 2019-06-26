import { describe, expect, it } from '../suite';
import Mock from '../../../src';

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

    it('single method expectation unmet', () => {
      interface Foo {
        bar(): void;
      }

      const mock = new Mock<Foo>();
      mock.when(f => f.bar()).returns(undefined);

      expect(() => mock.verifyAll()).to.throw();
    });

    it('single property expectation met', () => {
      interface Foo {
        bar: number;
      }

      const mock = new Mock<Foo>();
      mock.when(f => f.bar).returns(23);

      expect(() => mock.verifyAll()).to.throw();
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

      expect(() => mock.verifyAll()).to.throw();
    });
  });
});
