import { expect } from 'tdd-buffet/expect/jest';
import { describe, it } from 'tdd-buffet/suite/node';
import { instance, strongMock, when } from '../src';

describe('argument matching', () => {
  it('should match primitives', () => {
    const mock = strongMock<(x: number, y: string, z: boolean) => number>();

    when(mock(1, '2', true)).returns(23);

    expect(instance(mock)(1, '2', true)).toEqual(23);
  });

  it('should match objects', () => {
    const mock = strongMock<(foo: { bar: { baz: number } }) => number>();

    when(
      mock({
        bar: { baz: 42 }
      })
    ).returns(23);

    expect(
      instance(mock)({
        bar: { baz: 42 }
      })
    ).toEqual(23);
  });

  it('should match arrays', () => {
    const mock = strongMock<(foo: number[]) => number>();

    when(mock([1, 2, 3])).returns(23);

    expect(instance(mock)([1, 2, 3])).toEqual(23);
  });

  it('should match arrays', () => {
    const mock = strongMock<(foo: number[]) => number>();

    when(mock([1, 2, 3])).returns(23);

    expect(instance(mock)([1, 2, 3])).toEqual(23);
  });

  it('should match sets', () => {
    const mock = strongMock<(foo: Set<number>) => number>();

    when(mock(new Set([1, 2, 3]))).returns(23);

    expect(instance(mock)(new Set([1, 2, 3]))).toEqual(23);
  });

  it('should match maps', () => {
    const mock = strongMock<(foo: Map<number, boolean>) => number>();

    when(
      mock(
        new Map([
          [1, true],
          [2, false]
        ])
      )
    ).returns(23);

    expect(
      instance(mock)(
        new Map([
          [1, true],
          [2, false]
        ])
      )
    ).toEqual(23);
  });
});
