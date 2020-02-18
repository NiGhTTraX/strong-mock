import { expect } from 'tdd-buffet/expect/jest';
import { describe, it } from 'tdd-buffet/suite/node';
import { MissingReturnValue, UnexpectedCall } from '../src/errors';
import { instance } from '../src/instance';
import { strongMock, when } from '../src/mock';

describe('when', () => {
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
});
