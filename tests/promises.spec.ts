import { expect } from 'tdd-buffet/expect/chai';
import { describe, it } from 'tdd-buffet/suite/node';
import Mock from '../src';

describe('Mock', () => {
  describe('promises', () => {
    it('resolves', async () => {
      type Foo = () => Promise<number>;
      const mock = new Mock<Foo>();

      mock.when(f => f()).resolves(23);
      expect(await mock.stub()).to.equal(23);
    });

    it('returns', async () => {
      type Foo = () => Promise<number>;
      const mock = new Mock<Foo>();

      mock.when(f => f()).returns(Promise.resolve(23));
      expect(await mock.stub()).to.equal(23);
    });

    it('rejects error', async () => {
      type Foo = () => Promise<number>;
      const mock = new Mock<Foo>();

      mock.when(f => f()).rejects(new Error('foo'));

      return mock.stub()
        .then(() => {
          throw new Error('Expected promise to reject');
        })
        .catch(err => {
          expect(err.message).to.equal('foo');
        });
    });

    it('rejects message', async () => {
      type Foo = () => Promise<number>;
      const mock = new Mock<Foo>();

      mock.when(f => f()).rejects('foo');

      return mock.stub()
        .then(() => {
          throw new Error('Expected promise to reject');
        })
        .catch(err => {
          expect(err.message).to.equal('foo');
        });
    });
  });
});
