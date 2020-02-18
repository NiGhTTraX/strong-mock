import { expect } from 'tdd-buffet/expect/jest';
import { describe, it } from 'tdd-buffet/suite/node';
import { UnexpectedApplyError, WrongApplyArgsError } from '../src/errors';
import StrongMock from '../src/mock';

describe('Mock', () => {
  describe('function expectations', () => {
    it('no args and no return', () => {
      type Foo = () => void;

      const mock = new StrongMock<Foo>();
      mock.when(f => f()).returns(undefined);

      expect(mock.stub()).toBeUndefined();
    });

    it('no args and return', () => {
      type Foo = () => string;

      const mock = new StrongMock<Foo>();
      mock.when(f => f()).returns('bar');

      expect(mock.stub()).toEqual('bar');
    });

    it('1 arg and return', () => {
      type Foo = (x: string) => number;

      const mock = new StrongMock<Foo>();
      mock.when(f => f('bar')).returns(23);

      expect(mock.stub('bar')).toEqual(23);
    });

    it('2 args and return', () => {
      type Foo = (x: string, y: boolean) => number;

      const mock = new StrongMock<Foo>();
      mock.when(f => f('bar', true)).returns(23);

      expect(mock.stub('bar', true)).toEqual(23);
    });

    it('variadic args and return', () => {
      type Foo = (...args: number[]) => number;

      const mock = new StrongMock<Foo>();
      mock.when(f => f(1, 2, 3, 4)).returns(23);

      expect(mock.stub(1, 2, 3, 4)).toEqual(23);
    });

    it('multiple expectations with same args', () => {
      type Foo = (x: number) => number;

      const mock = new StrongMock<Foo>();
      mock.when(f => f(1)).returns(2);
      mock.when(f => f(1)).returns(3);

      expect(mock.stub(1)).toEqual(2);
      expect(mock.stub(1)).toEqual(3);
    });

    it('combined expectations', () => {
      interface Foo {
        (x: number): number;
        bar(y: number): number;
        baz: boolean;
      }

      const mock = new StrongMock<Foo>();
      mock.when(f => f(1)).returns(2);
      mock.when(f => f.bar(3)).returns(4);
      mock.when(f => f.baz).returns(true);

      expect(mock.stub(1)).toEqual(2);
      expect(mock.stub.bar(3)).toEqual(4);
      expect(mock.stub.baz).toBeTruthy();
    });

    it('inherited properties', () => {
      type Foo = (x: number) => number;

      const mock = new StrongMock<Foo>();
      mock.when(f => f.toString()).returns('foobar');

      expect(mock.stub.toString()).toEqual('foobar');
    });

    it('should not set an expectation with no return value', () => {
      type Foo = (x: number) => number;
      const mock = new StrongMock<Foo>();

      mock.when(f => f(1));
      expect(() => mock.verifyAll()).not.toThrow();

      mock.when(f => f(2)).returns(3);
      expect(mock.stub(2)).toEqual(3);
      expect(() => mock.verifyAll()).not.toThrow();
    });

    it('unexpected call', () => {
      type Foo = () => void;

      const mock = new StrongMock<Foo>();

      expect(() => mock.stub()).toThrow(UnexpectedApplyError);
    });

    it('called with wrong arg', () => {
      type Foo = (x: number) => void;

      const mock = new StrongMock<Foo>();
      mock.when(f => f(23)).returns(undefined);

      expect(() => mock.stub(21)).toThrow(WrongApplyArgsError);
    });

    it('called with wrong args', () => {
      type Foo = (x: number, y: number) => void;

      const mock = new StrongMock<Foo>();
      mock.when(f => f(1, 2)).returns(undefined);

      expect(() => mock.stub(3, 4)).toThrow(WrongApplyArgsError);
    });

    it('called with less variadic args', () => {
      type Foo = (...args: number[]) => void;

      const mock = new StrongMock<Foo>();
      mock.when(f => f(1, 2, 3)).returns(undefined);

      expect(() => mock.stub(1, 2)).toThrow(WrongApplyArgsError);
    });

    it('called with wrong variadic args', () => {
      type Foo = (...args: number[]) => void;

      const mock = new StrongMock<Foo>();
      mock.when(f => f(1, 2)).returns(undefined);

      expect(() => mock.stub(3, 4)).toThrow(WrongApplyArgsError);
    });

    it('.call', () => {
      const mock = new StrongMock<() => number>();
      mock.when(f => f()).returns(1);

      expect(mock.stub.call(null)).toEqual(1);
    });

    it('.call with args', () => {
      const mock = new StrongMock<(x: number) => number>();
      mock.when(f => f(1)).returns(1);

      expect(mock.stub.call(null, 1)).toEqual(1);
    });

    it('multiple .call', () => {
      const mock = new StrongMock<() => number>();
      mock.when(f => f()).returns(1);
      mock.when(f => f()).returns(2);

      expect(mock.stub.call(null)).toEqual(1);
      expect(mock.stub.call(null)).toEqual(2);
    });

    it('.apply', () => {
      const mock = new StrongMock<() => void>();
      mock.when(f => f()).returns(undefined);

      mock.stub.apply(null);
    });

    it('multiple .apply', () => {
      const mock = new StrongMock<() => number>();
      mock.when(f => f()).returns(1);
      mock.when(f => f()).returns(2);

      expect(mock.stub.apply(null)).toEqual(1);
      expect(mock.stub.apply(null)).toEqual(2);
    });

    it('.apply with args', () => {
      const mock = new StrongMock<(x: number) => number>();
      mock.when(f => f(1)).returns(1);

      expect(mock.stub.apply(null, [1])).toEqual(1);
    });

    it('throws error', () => {
      const mock = new StrongMock<() => void>();
      mock.when(f => f()).throws(new Error('foo'));

      expect(() => mock.stub()).toThrow('foo');
    });

    it('throws message', () => {
      const mock = new StrongMock<() => void>();
      mock.when(f => f()).throws('foo');

      expect(() => mock.stub()).toThrow('foo');
    });
  });
});
