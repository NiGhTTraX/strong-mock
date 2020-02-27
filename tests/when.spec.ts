import { expect } from 'tdd-buffet/expect/jest';
import { beforeEach, describe, it } from 'tdd-buffet/suite/node';
import { when } from '../src';
import { MissingReturnValue, MissingWhen, UnexpectedCall } from '../src/errors';
import { instance } from '../src/instance';
import { strongMock } from '../src/mock';
import { SINGLETON_PENDING_EXPECTATION } from '../src/pending-expectation';

describe('when', () => {
  beforeEach(() => {
    SINGLETON_PENDING_EXPECTATION.clear();
  });

  it('should do nothing without a chained return', () => {
    const fn = strongMock<() => void>();

    when(fn());
  });

  it('should throw if previous expectation is missing return', () => {
    const fn = strongMock<() => void>();

    when(fn());

    expect(() => when(fn())).toThrow(MissingReturnValue);
  });

  it('should set an expectation with no args and no return', () => {
    const fn = strongMock<() => void>();

    when(fn()).returns(undefined);

    expect(instance(fn)()).toBeUndefined();
  });

  it('should set an expectation with no args and a return', () => {
    const fn = strongMock<() => number>();

    when(fn()).returns(23);

    expect(instance(fn)()).toEqual(23);
  });

  it('should allow to set an expectation at any time', () => {
    const fn1 = strongMock<() => number>();

    const { returns: returns1 } = when(fn1());

    const fn2 = strongMock<() => number>();

    returns1(1);

    when(fn2()).returns(2);

    expect(instance(fn1)()).toEqual(1);
    expect(instance(fn2)()).toEqual(2);
  });

  it('should set multiple expectations with no args and a return', () => {
    const fn = strongMock<() => number>();

    when(fn()).returns(1);
    when(fn()).returns(2);

    expect(instance(fn)()).toEqual(1);
    expect(instance(fn)()).toEqual(2);
  });

  it('should set single expectations on different mocks', () => {
    const fn1 = strongMock<() => number>();
    const fn2 = strongMock<() => number>();

    when(fn1()).returns(1);
    when(fn2()).returns(2);

    // Call in reverse order.
    expect(instance(fn2)()).toEqual(2);
    expect(instance(fn1)()).toEqual(1);
  });

  it('should set multiple expectations on different mocks', () => {
    const fn1 = strongMock<() => number>();
    const fn2 = strongMock<() => number>();

    when(fn1()).returns(1);
    when(fn2()).returns(3);
    when(fn1()).returns(2);
    when(fn2()).returns(4);

    // Call in reverse order.
    expect(instance(fn2)()).toEqual(3);
    expect(instance(fn1)()).toEqual(1);
    expect(instance(fn2)()).toEqual(4);
    expect(instance(fn1)()).toEqual(2);
  });

  it('should throw when no matching expectations', () => {
    const fn = strongMock<() => void>();

    expect(() => instance(fn)()).toThrow(UnexpectedCall);
  });

  it('should throw when after all expectations are met', () => {
    const fn = strongMock<() => void>();

    when(fn()).returns(undefined);

    instance(fn)();

    expect(() => instance(fn)()).toThrow(UnexpectedCall);
  });

  it('should allow setting new expectations after previous are consumed', () => {
    const fn = strongMock<() => number>();

    when(fn()).returns(1);
    expect(instance(fn)()).toEqual(1);

    when(fn()).returns(2);
    expect(instance(fn)()).toEqual(2);
  });

  it('should let functions be called with .call and .apply', () => {
    const fn = strongMock<(x: number, y: number) => number>();

    when(fn(1, 2)).returns(3);
    when(fn(4, 5)).returns(6);

    expect(instance(fn).apply(null, [1, 2])).toEqual(3);
    expect(instance(fn).call(null, 4, 5)).toEqual(6);
  });

  it('should set expectation on .call', () => {
    const fn = strongMock<(x: number, y: number) => number>();

    when(fn.call(null, 1, 2)).returns(3);

    expect(instance(fn)(1, 2)).toEqual(3);
  });

  it('should set expectation on .apply', () => {
    const fn = strongMock<(x: number, y: number) => number>();

    when(fn.apply(null, [1, 2])).returns(3);

    expect(instance(fn)(1, 2)).toEqual(3);
  });

  it('should set expectations with args and return', () => {
    const fn = strongMock<(x: number) => number>();

    when(fn(1)).returns(23);
    when(fn(2)).returns(42);
    when(fn(3)).returns(99);

    expect(instance(fn)(2)).toEqual(42);
    expect(instance(fn)(1)).toEqual(23);
    expect(instance(fn)(3)).toEqual(99);
  });

  it('should set expectations with args and return', () => {
    const fn = strongMock<(x: number) => number>();

    const stub = when(fn(1));

    stub.returns(2);

    expect(() => stub.returns(3)).toThrow(MissingWhen);
  });

  describe('interface', () => {
    it('should set expectation on one method', () => {
      interface Foo {
        bar(x: number): number;
      }

      const foo = strongMock<Foo>();

      when(foo.bar(1)).returns(23);

      expect(instance(foo).bar(1)).toEqual(23);
    });

    it('should set expectations on multiple methods', () => {
      interface Foo {
        bar(x: number): number;
        baz(x: number): number;
      }

      const foo = strongMock<Foo>();

      when(foo.bar(1)).returns(-1);
      when(foo.baz(1)).returns(-2);

      expect(instance(foo).baz(1)).toEqual(-2);
      expect(instance(foo).bar(1)).toEqual(-1);
    });

    it('should set expectations on function and methods', () => {
      interface Foo {
        (x: number): number;
        bar(y: number): number;
      }

      const foo = strongMock<Foo>();

      when(foo(1)).returns(2);
      when(foo.bar(3)).returns(4);

      expect(instance(foo)(1)).toEqual(2);
      expect(instance(foo).bar(3)).toEqual(4);
    });

    it('should set expectations on string members', () => {
      interface Foo {
        bar: number;
      }

      const foo = strongMock<Foo>();

      when(foo.bar).returns(23);

      expect(instance(foo).bar).toEqual(23);
    });

    it('should set expectations on symbol members', () => {
      const s = Symbol('s');

      interface Foo {
        [s]: number;
      }

      const foo = strongMock<Foo>();

      when(foo[s]).returns(23);

      expect(instance(foo)[s]).toEqual(23);
    });

    it('should set expectations on number members', () => {
      interface Foo {
        0: number;
      }

      const foo = strongMock<Foo>();

      when(foo[0]).returns(23);

      expect(instance(foo)[0]).toEqual(23);
    });
  });
});
