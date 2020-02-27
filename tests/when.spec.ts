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
    const mock = strongMock<() => void>();

    when(mock());
  });

  it('should throw if previous expectation is missing return', () => {
    const mock = strongMock<() => void>();

    when(mock());

    expect(() => when(mock())).toThrow(MissingReturnValue);
  });

  it('should set an expectation with no args and no return', () => {
    const mock = strongMock<() => void>();

    when(mock()).returns(undefined);

    expect(instance(mock)()).toBeUndefined();
  });

  it('should set an expectation with no args and a return', () => {
    const mock = strongMock<() => number>();

    when(mock()).returns(23);

    expect(instance(mock)()).toEqual(23);
  });

  it('should allow to set an expectation at any time', () => {
    const mock1 = strongMock<() => number>();

    const { returns: returns1 } = when(mock1());

    const mock2 = strongMock<() => number>();

    returns1(1);

    when(mock2()).returns(2);

    expect(instance(mock1)()).toEqual(1);
    expect(instance(mock2)()).toEqual(2);
  });

  it('should set multiple expectations with no args and a return', () => {
    const mock = strongMock<() => number>();

    when(mock()).returns(1);
    when(mock()).returns(2);

    expect(instance(mock)()).toEqual(1);
    expect(instance(mock)()).toEqual(2);
  });

  it('should set single expectations on different mocks', () => {
    const mock1 = strongMock<() => number>();
    const mock2 = strongMock<() => number>();

    when(mock1()).returns(1);
    when(mock2()).returns(2);

    // Call in reverse order.
    expect(instance(mock2)()).toEqual(2);
    expect(instance(mock1)()).toEqual(1);
  });

  it('should set multiple expectations on different mocks', () => {
    const mock1 = strongMock<() => number>();
    const mock2 = strongMock<() => number>();

    when(mock1()).returns(1);
    when(mock2()).returns(3);
    when(mock1()).returns(2);
    when(mock2()).returns(4);

    // Call in reverse order.
    expect(instance(mock2)()).toEqual(3);
    expect(instance(mock1)()).toEqual(1);
    expect(instance(mock2)()).toEqual(4);
    expect(instance(mock1)()).toEqual(2);
  });

  it('should throw when no matching expectations', () => {
    const mock = strongMock<() => void>();

    expect(() => instance(mock)()).toThrow(UnexpectedCall);
  });

  it('should throw when after all expectations are met', () => {
    const mock = strongMock<() => void>();

    when(mock()).returns(undefined);

    instance(mock)();

    expect(() => instance(mock)()).toThrow(UnexpectedCall);
  });

  it('should allow setting new expectations after previous are consumed', () => {
    const mock = strongMock<() => number>();

    when(mock()).returns(1);
    expect(instance(mock)()).toEqual(1);

    when(mock()).returns(2);
    expect(instance(mock)()).toEqual(2);
  });

  it('should let functions be called with .call and .apply', () => {
    const mock = strongMock<(x: number, y: number) => number>();

    when(mock(1, 2)).returns(3);
    when(mock(4, 5)).returns(6);

    expect(instance(mock).apply(null, [1, 2])).toEqual(3);
    expect(instance(mock).call(null, 4, 5)).toEqual(6);
  });

  it('should set expectation on .call', () => {
    const mock = strongMock<(x: number, y: number) => number>();

    when(mock.call(null, 1, 2)).returns(3);

    expect(instance(mock)(1, 2)).toEqual(3);
  });

  it('should set expectation on .apply', () => {
    const mock = strongMock<(x: number, y: number) => number>();

    when(mock.apply(null, [1, 2])).returns(3);

    expect(instance(mock)(1, 2)).toEqual(3);
  });

  it('should set expectations with args and return', () => {
    const mock = strongMock<(x: number) => number>();

    when(mock(1)).returns(23);
    when(mock(2)).returns(42);
    when(mock(3)).returns(99);

    expect(instance(mock)(2)).toEqual(42);
    expect(instance(mock)(1)).toEqual(23);
    expect(instance(mock)(3)).toEqual(99);
  });

  it('should set expectations with args and return', () => {
    const mock = strongMock<(x: number) => number>();

    const stub = when(mock(1));

    stub.returns(2);

    expect(() => stub.returns(3)).toThrow(MissingWhen);
  });

  describe('interface', () => {
    it('should set expectation on one method', () => {
      interface Foo {
        bar(x: number): number;
      }

      const mock = strongMock<Foo>();

      when(mock.bar(1)).returns(23);

      expect(instance(mock).bar(1)).toEqual(23);
    });

    it('should set expectations on multiple methods', () => {
      interface Foo {
        bar(x: number): number;
        baz(x: number): number;
      }

      const mock = strongMock<Foo>();

      when(mock.bar(1)).returns(-1);
      when(mock.baz(1)).returns(-2);

      expect(instance(mock).baz(1)).toEqual(-2);
      expect(instance(mock).bar(1)).toEqual(-1);
    });

    it('should set expectations on function and methods', () => {
      interface Foo {
        (x: number): number;
        bar(y: number): number;
      }

      const mock = strongMock<Foo>();

      when(mock(1)).returns(2);
      when(mock.bar(3)).returns(4);

      expect(instance(mock)(1)).toEqual(2);
      expect(instance(mock).bar(3)).toEqual(4);
    });

    it('should set expectations on members', () => {
      interface Foo {
        bar: number;
      }

      const mock = strongMock<Foo>();

      when(mock.bar).returns(23);

      expect(instance(mock).bar).toEqual(23);
    });
  });
});
