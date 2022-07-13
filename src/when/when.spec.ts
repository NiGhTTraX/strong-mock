import { mock, when } from '..';
import { MissingWhen, UnfinishedExpectation } from '../errors';
import { clearActiveMock } from '../mock/map';

describe('e2e', () => {
  beforeEach(() => {
    clearActiveMock();
  });

  it('should do nothing without a chained return', () => {
    const fn = mock<() => void>();

    when(() => fn());
  });

  it('should throw if previous expectation was not finished', () => {
    const fn = mock<() => void>();

    when(() => fn());

    expect(() => when(() => fn())).toThrow(UnfinishedExpectation);
  });

  it('should allow to set an expectation after another mock was created', () => {
    const fn1 = mock<() => number>();

    const { thenReturn: returns1 } = when(() => fn1());

    const fn2 = mock<() => number>();

    returns1(1);

    when(() => fn2()).thenReturn(2);

    expect(fn1()).toEqual(1);
    expect(fn2()).toEqual(2);
  });

  it('should throw when setting a return value without an expectation', () => {
    const fn = mock<(x: number) => number>();

    const stub = when(() => fn(1));

    stub.thenReturn(2);

    expect(() => stub.thenReturn(3)).toThrow(MissingWhen);
  });

  it('should set multiple expectations', () => {
    const fn = mock<() => number>();

    when(() => fn()).thenReturn(1);
    when(() => fn()).thenReturn(2);

    expect(fn()).toEqual(1);
    expect(fn()).toEqual(2);
  });

  it('should set expectations on different mocks', () => {
    const fn1 = mock<() => number>();
    const fn2 = mock<() => number>();

    when(() => fn1()).thenReturn(1);
    when(() => fn2()).thenReturn(2);

    // Call in reverse order.
    expect(fn2()).toEqual(2);
    expect(fn1()).toEqual(1);
  });
});
