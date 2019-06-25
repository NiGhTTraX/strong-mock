import { describe, expect, it } from '../../../../../tests/node/suite';
import Mock from '../../../src';

describe('Mock', () => {
  describe('errors', () => {
    it('method never called', () => {
      interface Foo {
        bar(): void;
      }

      const mock = new Mock<Foo>();
      mock.when(f => f.bar()).returns(undefined);

      expect(() => mock.verifyAll()).to.throw(/bar/);
    });

    it('method unexpected call', () => {
      interface Foo {
        bar(): void;
      }

      const mock = new Mock<Foo>();

      expect(() => mock.object.bar()).to.throw();
    });

    it('method called with wrong arg', () => {
      interface Foo {
        bar(x: number): void;
      }

      const mock = new Mock<Foo>();
      mock.when(f => f.bar(23)).returns(undefined);

      expect(() => mock.object.bar(21)).to.throw(/21(.*)23/s);
    });

    it('method called with wrong args', () => {
      interface Foo {
        bar(x: number, y: number): void;
      }

      const mock = new Mock<Foo>();
      mock.when(f => f.bar(1, 2)).returns(undefined);

      expect(() => mock.object.bar(3, 4))
        .to.throw(/3(.*)4(.*)1(.*)2/s);
    });

    it('method called with less variadic args', () => {
      interface Foo {
        bar(...args: number[]): void;
      }

      const mock = new Mock<Foo>();
      mock.when(f => f.bar(1, 2, 3)).returns(undefined);

      expect(() => mock.object.bar(1, 2))
        .to.throw(/1(.*)2(.*)1(.*)2(.*)3/s);
    });

    it('method called with more variadic args', () => {
      interface Foo {
        bar(...args: number[]): void;
      }

      const mock = new Mock<Foo>();
      mock.when(f => f.bar(1, 2)).returns(undefined);

      expect(() => mock.object.bar(1, 2, 3))
        .to.throw(/1(.*)2(.*)3(.*)1(.*)2/s);
    });

    it('method called with wrong variadic args', () => {
      interface Foo {
        bar(...args: number[]): void;
      }

      const mock = new Mock<Foo>();
      mock.when(f => f.bar(1, 2)).returns(undefined);

      expect(() => mock.object.bar(3, 4))
        .to.throw(/3(.*)4(.*)1(.*)2/s);
    });

    it('property never called', () => {
      interface Foo {
        bar: number;
      }

      const mock = new Mock<Foo>();
      mock.when(f => f.bar).returns(23);

      expect(() => mock.verifyAll()).to.throw(/bar/s);
    });
  });
});
