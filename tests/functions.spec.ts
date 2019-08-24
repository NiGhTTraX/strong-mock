import { expect } from 'tdd-buffet/suite/expect';
import { describe, it } from 'tdd-buffet/suite/node';
import { UnexpectedApplyError, WrongApplyArgsError } from '../src/errors';
import Mock from '../src/mock';

describe('Mock', () => {
  describe('function expectations', () => {
    it('no args and no return', () => {
      type Foo = () => void;

      const mock = new Mock<Foo>();
      mock.when(f => f()).returns(undefined);

      expect(mock.stub()).to.be.undefined;
    });

    it('no args and return', () => {
      type Foo = () => string;

      const mock = new Mock<Foo>();
      mock.when(f => f()).returns('bar');

      expect(mock.stub()).to.equal('bar');
    });

    it('1 arg and return', () => {
      type Foo = (x: string) => number;

      const mock = new Mock<Foo>();
      mock.when(f => f('bar')).returns(23);

      expect(mock.stub('bar')).to.equal(23);
    });

    it('2 args and return', () => {
      type Foo = (x: string, y: boolean) => number;

      const mock = new Mock<Foo>();
      mock.when(f => f('bar', true)).returns(23);

      expect(mock.stub('bar', true)).to.equal(23);
    });

    it('variadic args and return', () => {
      type Foo = (...args: number[]) => number;

      const mock = new Mock<Foo>();
      mock.when(f => f(1, 2, 3, 4)).returns(23);

      expect(mock.stub(1, 2, 3, 4)).to.equal(23);
    });

    it('optional arg and passed', () => {
      type Foo = (x?: number) => number;

      const mock = new Mock<Foo>();
      mock.when(f => f(1)).returns(2);

      expect(mock.stub(1)).to.equal(2);
    });

    it('optional arg and missing', () => {
      type Foo = (x?: number) => number;

      const mock = new Mock<Foo>();
      mock.when(f => f()).returns(3);

      expect(mock.stub()).to.equal(3);
    });

    it('optional arg and passed undefined', () => {
      type Foo = (x?: number) => number;

      const mock = new Mock<Foo>();
      mock.when(f => f()).returns(4);

      expect(mock.stub(undefined)).to.equal(4);
    });

    it('optional arg and expected undefined and missing', () => {
      type Foo = (x?: number) => number;

      const mock = new Mock<Foo>();
      mock.when(f => f(undefined)).returns(4);

      expect(mock.stub()).to.equal(4);
    });

    it('optional arg and expected undefined and passed undefined', () => {
      type Foo = (x?: number) => number;

      const mock = new Mock<Foo>();
      mock.when(f => f(undefined)).returns(4);

      expect(mock.stub(undefined)).to.equal(4);
    });

    it('multiple expectations with same args', () => {
      type Foo = (x: number) => number;

      const mock = new Mock<Foo>();
      mock.when(f => f(1)).returns(2);
      mock.when(f => f(1)).returns(3);

      expect(mock.stub(1)).to.equal(2);
      expect(mock.stub(1)).to.equal(3);
    });

    it('combined expectations', () => {
      interface Foo {
        (x: number): number;
        bar(y: number): number;
        baz: boolean;
      }

      const mock = new Mock<Foo>();
      mock.when(f => f(1)).returns(2);
      mock.when(f => f.bar(3)).returns(4);
      mock.when(f => f.baz).returns(true);

      expect(mock.stub(1)).to.equal(2);
      expect(mock.stub.bar(3)).to.equal(4);
      expect(mock.stub.baz).to.be.true;
    });

    it('inherited properties', () => {
      type Foo = (x: number) => number;

      const mock = new Mock<Foo>();
      mock.when(f => f.toString()).returns('foobar');

      expect(mock.stub.toString()).to.equal('foobar');
    });

    it('should not set an expectation with no return value', () => {
      type Foo = (x: number) => number;
      const mock = new Mock<Foo>();

      mock.when(f => f(1));
      expect(() => mock.verifyAll()).to.not.throw();

      mock.when(f => f(2)).returns(3);
      expect(mock.stub(2)).to.equal(3);
      expect(() => mock.verifyAll()).to.not.throw();
    });

    it('unexpected call', () => {
      type Foo = () => void;

      const mock = new Mock<Foo>();

      expect(() => mock.stub()).to.throw(UnexpectedApplyError);
    });

    it('called with wrong arg', () => {
      type Foo = (x: number) => void;

      const mock = new Mock<Foo>();
      mock.when(f => f(23)).returns(undefined);

      expect(() => mock.stub(21)).to.throw(WrongApplyArgsError);
    });

    it('called with wrong args', () => {
      type Foo = (x: number, y: number) => void;

      const mock = new Mock<Foo>();
      mock.when(f => f(1, 2)).returns(undefined);

      expect(() => mock.stub(3, 4)).to.throw(WrongApplyArgsError);
    });

    it('called with less variadic args', () => {
      type Foo = (...args: number[]) => void;

      const mock = new Mock<Foo>();
      mock.when(f => f(1, 2, 3)).returns(undefined);

      expect(() => mock.stub(1, 2)).to.throw(WrongApplyArgsError);
    });

    it('called with more variadic args', () => {
      type Foo = (...args: number[]) => void;

      const mock = new Mock<Foo>();
      mock.when(f => f(1, 2)).returns(undefined);

      expect(() => mock.stub(1, 2, 3)).to.throw(WrongApplyArgsError);
    });

    it('called with wrong variadic args', () => {
      type Foo = (...args: number[]) => void;

      const mock = new Mock<Foo>();
      mock.when(f => f(1, 2)).returns(undefined);

      expect(() => mock.stub(3, 4)).to.throw(WrongApplyArgsError);
    });
  });
});
