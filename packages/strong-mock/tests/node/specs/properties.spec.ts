import { describe, expect, it } from '../../../../../tests/node/suite';
import Mock from '../../../src';

describe('Mock', () => {
  describe('property expectations', () => {
    it('primitive', () => {
      interface Foo {
        bar: number;
      }

      const mock = new Mock<Foo>();
      mock.when(f => f.bar).returns(23);

      expect(mock.object.bar).to.equal(23);
    });

    it('undefined', () => {
      interface Foo {
        bar: undefined;
      }

      const mock = new Mock<Foo>();
      mock.when(f => f.bar).returns(undefined);

      expect(mock.object.bar).to.be.undefined;
    });

    it('array', () => {
      interface Foo {
        bar: number[];
      }

      const mock = new Mock<Foo>();
      mock.when(f => f.bar).returns([1, 2]);

      expect(mock.object.bar).to.deep.equal([1, 2]);
    });
  });
});
