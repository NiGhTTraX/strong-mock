import { expect } from 'tdd-buffet/expect/jest';
import { beforeEach, describe, it } from 'tdd-buffet/suite/node';
import { when } from '../src';
import { MissingReturnValue, MissingWhen, UnexpectedCall } from '../src/errors';
import { instance } from '../src/instance';
import { mock } from '../src/mock';
import { SINGLETON_PENDING_EXPECTATION } from '../src/pending-expectation';

describe('when', () => {
  beforeEach(() => {
    SINGLETON_PENDING_EXPECTATION.clear();
  });

  it('should do nothing without a chained return', () => {
    const fn = mock<() => void>();

    when(fn());
  });

  it('should throw if previous expectation was not finished', () => {
    const fn = mock<() => void>();

    when(fn());

    expect(() => when(fn())).toThrow(MissingReturnValue);
  });

  it('should allow to set an expectation after another mock was created', () => {
    const fn1 = mock<() => number>();

    const { returns: returns1 } = when(fn1());

    const fn2 = mock<() => number>();

    returns1(1);

    when(fn2()).returns(2);

    expect(instance(fn1)()).toEqual(1);
    expect(instance(fn2)()).toEqual(2);
  });

  it('should throw when setting a return value without an expectation', () => {
    const fn = mock<(x: number) => number>();

    const stub = when(fn(1));

    stub.returns(2);

    expect(() => stub.returns(3)).toThrow(MissingWhen);
  });

  it('should set multiple expectations', () => {
    const fn = mock<() => number>();

    when(fn()).returns(1);
    when(fn()).returns(2);

    expect(instance(fn)()).toEqual(1);
    expect(instance(fn)()).toEqual(2);
  });

  it('should set expectations on different mocks', () => {
    const fn1 = mock<() => number>();
    const fn2 = mock<() => number>();

    when(fn1()).returns(1);
    when(fn2()).returns(2);

    // Call in reverse order.
    expect(instance(fn2)()).toEqual(2);
    expect(instance(fn1)()).toEqual(1);
  });

  it('should throw when no matching expectations', () => {
    const fn = mock<() => void>();

    expect(() => instance(fn)()).toThrow(UnexpectedCall);
  });

  it('should throw after all expectations are met', () => {
    const fn = mock<() => void>();

    when(fn()).returns(undefined);

    instance(fn)();

    expect(() => instance(fn)()).toThrow(UnexpectedCall);
  });

  it('should set expectation to throw', () => {
    const fn = mock<() => {}>();
    const error = new Error();

    when(fn()).throws(error);

    expect(() => instance(fn)()).toThrow(error);
  });

  it('should set expectation with promise', async () => {
    const fn = mock<() => Promise<number>>();

    when(fn()).resolves(23);

    await expect(instance(fn)()).resolves.toEqual(23);
  });

  describe('interface', () => {
    it('should set expectation on method', () => {
      interface Foo {
        bar(x: number): number;
      }

      const foo = mock<Foo>();

      when(foo.bar(1)).returns(23);

      expect(instance(foo).bar(1)).toEqual(23);
    });

    it('should set expectation on member', () => {
      interface Foo {
        bar: number;
      }

      const foo = mock<Foo>();

      when(foo.bar).returns(23);

      expect(instance(foo).bar).toEqual(23);
    });
  });
});
