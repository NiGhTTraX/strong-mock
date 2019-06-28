import { describe, expect, it } from '../suite';
import Mock from '../../../src/mock';
import { UnexpectedAccessError } from '../../../src/errors';

describe('Mock', () => {
  describe('property expectations', () => {
    it('primitive', () => {
      interface Foo {
        bar: number;
      }

      const mock = new Mock<Foo>();
      mock.when(f => f.bar).returns(23);

      expect(mock.stub.bar).to.equal(23);
    });

    it('undefined', () => {
      interface Foo {
        bar: undefined;
      }

      const mock = new Mock<Foo>();
      mock.when(f => f.bar).returns(undefined);

      expect(mock.stub.bar).to.be.undefined;
    });

    it('array', () => {
      interface Foo {
        bar: number[];
      }

      const mock = new Mock<Foo>();
      mock.when(f => f.bar).returns([1, 2]);

      expect(mock.stub.bar).to.deep.equal([1, 2]);
    });

    it('multiple expectations', () => {
      interface Foo {
        bar: number;
      }

      const mock = new Mock<Foo>();
      mock.when(f => f.bar).returns(1);
      mock.when(f => f.bar).returns(2);

      expect(mock.stub.bar).to.equal(1);
      expect(mock.stub.bar).to.equal(2);
    });

    it('unexpected', () => {
      interface Foo {
        bar: number;
      }

      const mock = new Mock<Foo>();
      mock.when(f => f.bar).returns(1);
      mock.stub.bar;

      expect(() => mock.stub.bar).to.throw(UnexpectedAccessError);
    });
  });
});
