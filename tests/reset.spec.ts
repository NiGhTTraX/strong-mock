import { expect } from 'tdd-buffet/suite/expect';
import { describe, it } from 'tdd-buffet/suite/node';
import Mock from '../src/mock';

describe('Mock', () => {
  describe('reset', () => {
    it('methods', () => {
      interface Foo {
        bar(x: number): number;
      }
      const mock = new Mock<Foo>();

      mock.when(f => f.bar(1)).returns(2);
      mock.reset();

      expect(() => mock.verifyAll()).to.not.throw();

      mock.when(f => f.bar(3)).returns(4);

      expect(mock.stub.bar(3)).to.equal(4);
      expect(() => mock.stub.bar(1)).to.throw();
    });

    it('properties', () => {
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
