import { describe, expect, it } from '../../../../../tests/node/suite';
import XMock from '../../../src';

describe('XMock', () => {
  describe('errors', () => {
    it('method never called', () => {
      interface Foo {
        bar(): void;
      }

      const mock = new XMock<Foo>();
      mock.when(f => f.bar()).returns(undefined);

      expect(() => mock.verifyAll()).to.throw(/bar/);
    });

    it('method unexpected call', () => {
      interface Foo {
        bar(): void;
      }

      const mock = new XMock<Foo>();

      expect(() => mock.object.bar()).to.throw();
    });


    it('method called with wrong args', () => {
      interface Foo {
        bar(x: number): void;
      }

      const mock = new XMock<Foo>();
      mock.when(f => f.bar(23)).returns(undefined);

      expect(() => mock.object.bar(21)).to.throw(/21(.*)23/s);
    });
  });
});
