import { expect } from 'tdd-buffet/expect/jest';
import { beforeEach, describe, it } from 'tdd-buffet/suite/node';
import { when } from '../src';
import { MissingWhen, UnfinishedExpectation } from '../src/errors';
import { instance } from '../src/instance';
import { It } from '../src/matcher';
import { mock } from '../src/mock';
import { SINGLETON_PENDING_EXPECTATION } from '../src/pending-expectation';
import { Fn } from './fixtures';

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

    expect(() => when(fn())).toThrow(UnfinishedExpectation);
  });

  it('should allow to set an expectation after another mock was created', () => {
    const fn1 = mock<() => number>();

    const { thenReturn: returns1 } = when(fn1());

    const fn2 = mock<() => number>();

    returns1(1);

    when(fn2()).thenReturn(2);

    expect(instance(fn1)()).toEqual(1);
    expect(instance(fn2)()).toEqual(2);
  });

  it('should throw when setting a return value without an expectation', () => {
    const fn = mock<(x: number) => number>();

    const stub = when(fn(1));

    stub.thenReturn(2);

    expect(() => stub.thenReturn(3)).toThrow(MissingWhen);
  });

  it('should not throw if called without when or instance', () => {
    const fn = mock<() => void>();

    fn();
  });

  it('should set multiple expectations', () => {
    const fn = mock<() => number>();

    when(fn()).thenReturn(1);
    when(fn()).thenReturn(2);

    expect(instance(fn)()).toEqual(1);
    expect(instance(fn)()).toEqual(2);
  });

  it('should set expectations on different mocks', () => {
    const fn1 = mock<() => number>();
    const fn2 = mock<() => number>();

    when(fn1()).thenReturn(1);
    when(fn2()).thenReturn(2);

    // Call in reverse order.
    expect(instance(fn2)()).toEqual(2);
    expect(instance(fn1)()).toEqual(1);
  });

  it('should set expectation to throw', () => {
    const fn = mock<() => {}>();
    const error = new Error();

    when(fn()).thenThrow(error);

    expect(() => instance(fn)()).toThrow(error);
  });

  it('should set expectation with promise', async () => {
    const fn = mock<() => Promise<number>>();

    when(fn()).thenResolve(23);

    await expect(instance(fn)()).resolves.toEqual(23);
  });

  it('should support ignoring arguments', () => {
    const fn = mock<Fn>();

    when(
      fn(
        1,
        It.isAny(),
        It.matches(z => z === 3)
      )
    ).thenReturn(23);

    expect(instance(fn)(1, 2, 3)).toEqual(23);
  });

  describe('interface', () => {
    it('should set expectation on method', () => {
      interface Foo {
        bar(x: number): number;
      }

      const foo = mock<Foo>();

      when(foo.bar(1)).thenReturn(23);

      expect(instance(foo).bar(1)).toEqual(23);
    });

    it('should set expectation on member', () => {
      interface Foo {
        bar: number;
      }

      const foo = mock<Foo>();

      when(foo.bar).thenReturn(23);

      expect(instance(foo).bar).toEqual(23);
    });
  });
});
