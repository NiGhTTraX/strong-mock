import { describe, expect, it } from '../suite';
import Mock from '../../../src/mock';

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

    it('reset', () => {
      interface Foo {
        bar: number;
      }
      const mock = new Mock<Foo>();

      mock.when(f => f.bar).returns(2);
      mock.reset();

      expect(() => mock.verifyAll()).to.not.throw();

      mock.when(f => f.bar).returns(4);

      expect(mock.stub.bar).to.equal(4);
    });
  });
});
