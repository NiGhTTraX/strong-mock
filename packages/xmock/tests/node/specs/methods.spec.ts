import { describe, expect, it } from '../../../../../tests/node/suite';
import XMock from '../../../src';

describe('XMock', () => {
  describe('method expectations', () => {
    it('no args and no return', () => {
      interface Foo {
        bar(): void;
      }

      const mock = new XMock<Foo>();
      mock.when(f => f.bar()).returns(undefined);

      expect(mock.object.bar()).to.be.undefined;
    });

    it('no args and return', () => {
      interface Foo {
        bar(): string;
      }

      const mock = new XMock<Foo>();
      mock.when(f => f.bar()).returns('bar');

      expect(mock.object.bar()).to.equal('bar');
    });

    it('1 arg and return', () => {
      interface Foo {
        bar(x: string): number;
      }

      const mock = new XMock<Foo>();
      mock.when(f => f.bar('bar')).returns(23);

      expect(mock.object.bar('bar')).to.equal(23);
    });

    it('2 args and return', () => {
      interface Foo {
        bar(x: string, y: boolean): number;
      }

      const mock = new XMock<Foo>();
      mock.when(f => f.bar('bar', true)).returns(23);

      expect(mock.object.bar('bar', true)).to.equal(23);
    });

    it('variadic args and return', () => {
      interface Foo {
        bar(...args: number[]): number;
      }

      const mock = new XMock<Foo>();
      mock.when(f => f.bar(1, 2, 3, 4)).returns(23);

      expect(mock.object.bar(1, 2, 3, 4)).to.equal(23);
    });
  });
});
