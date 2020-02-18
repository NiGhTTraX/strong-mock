import { expect } from 'tdd-buffet/expect/jest';
import { describe, it } from 'tdd-buffet/suite/node';
import { UnexpectedAccessError, WrongMethodArgsError } from '../src/errors';
import StrongMock from '../src/mock';

describe('Mock', () => {
  describe('method expectations', () => {
    it('no args and no return', () => {
      interface Foo {
        bar(): void;
      }

      const mock = new StrongMock<Foo>();
      mock.when(f => f.bar()).returns(undefined);

      expect(mock.stub.bar()).toBeUndefined();
    });

    it('no args and return', () => {
      interface Foo {
        bar(): string;
      }

      const mock = new StrongMock<Foo>();
      mock.when(f => f.bar()).returns('bar');

      expect(mock.stub.bar()).toEqual('bar');
    });

    it('1 arg and return', () => {
      interface Foo {
        bar(x: string): number;
      }

      const mock = new StrongMock<Foo>();
      mock.when(f => f.bar('bar')).returns(23);

      expect(mock.stub.bar('bar')).toEqual(23);
    });

    it('2 args and return', () => {
      interface Foo {
        bar(x: string, y: boolean): number;
      }

      const mock = new StrongMock<Foo>();
      mock.when(f => f.bar('bar', true)).returns(23);

      expect(mock.stub.bar('bar', true)).toEqual(23);
    });

    it('variadic args and return', () => {
      interface Foo {
        bar(...args: number[]): number;
      }

      const mock = new StrongMock<Foo>();
      mock.when(f => f.bar(1, 2, 3, 4)).returns(23);

      expect(mock.stub.bar(1, 2, 3, 4)).toEqual(23);
    });

    it('multiple expectations with same args', () => {
      interface Foo {
        bar(x: number): number;
      }

      const mock = new StrongMock<Foo>();
      mock.when(f => f.bar(1)).returns(2);
      mock.when(f => f.bar(1)).returns(3);

      expect(mock.stub.bar(1)).toEqual(2);
      expect(mock.stub.bar(1)).toEqual(3);
    });

    it('should not set an expectation with no return value', () => {
      interface Foo {
        bar(x: number): number;
      }
      const mock = new StrongMock<Foo>();

      mock.when(f => f.bar(1));
      expect(() => mock.verifyAll()).not.toThrow();

      mock.when(f => f.bar(2)).returns(3);
      expect(mock.stub.bar(2)).toEqual(3);
      expect(() => mock.verifyAll()).not.toThrow();
    });

    it('unexpected call', () => {
      interface Foo {
        bar(): void;
      }

      const mock = new StrongMock<Foo>();

      expect(() => mock.stub.bar()).toThrow(UnexpectedAccessError);
    });

    it('called with wrong arg', () => {
      interface Foo {
        bar(x: number): void;
      }

      const mock = new StrongMock<Foo>();
      mock.when(f => f.bar(23)).returns(undefined);

      expect(() => mock.stub.bar(21)).toThrow(WrongMethodArgsError);
    });

    it('called with wrong args', () => {
      interface Foo {
        bar(x: number, y: number): void;
      }

      const mock = new StrongMock<Foo>();
      mock.when(f => f.bar(1, 2)).returns(undefined);

      expect(() => mock.stub.bar(3, 4)).toThrow(WrongMethodArgsError);
    });

    it('called with less variadic args', () => {
      interface Foo {
        bar(...args: number[]): void;
      }

      const mock = new StrongMock<Foo>();
      mock.when(f => f.bar(1, 2, 3)).returns(undefined);

      expect(() => mock.stub.bar(1, 2)).toThrow(WrongMethodArgsError);
    });

    it('called with wrong variadic args', () => {
      interface Foo {
        bar(...args: number[]): void;
      }

      const mock = new StrongMock<Foo>();
      mock.when(f => f.bar(1, 2)).returns(undefined);

      expect(() => mock.stub.bar(3, 4)).toThrow(WrongMethodArgsError);
    });

    it('throws error', () => {
      const mock = new StrongMock<{ foo: () => void }>();
      mock.when(m => m.foo()).throws(new Error('foo'));

      expect(() => mock.stub.foo()).toThrow('foo');
    });

    it('throws message', () => {
      const mock = new StrongMock<{ foo: () => void }>();
      mock.when(m => m.foo()).throws('foo');

      expect(() => mock.stub.foo()).toThrow('foo');
    });
  });
});
