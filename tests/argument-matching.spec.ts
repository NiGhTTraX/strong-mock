import { expect } from 'tdd-buffet/expect/jest';
import { describe, it } from 'tdd-buffet/suite/node';
import { instance, mock, when } from '../src';
import { UnexpectedCall } from '../src/errors';

describe('argument matching', () => {
  it('should match primitives', () => {
    const fn = mock<(x: number, y: string, z: boolean) => number>();

    when(fn(1, '2', true)).returns(23);

    expect(instance(fn)(1, '2', true)).toEqual(23);
  });

  it('should match objects', () => {
    const fn = mock<(foo: { bar: { baz: number } }) => number>();

    when(
      fn({
        bar: { baz: 42 }
      })
    ).returns(23);

    expect(
      instance(fn)({
        bar: { baz: 42 }
      })
    ).toEqual(23);
  });

  it('should match arrays', () => {
    const fn = mock<(foo: number[]) => number>();

    when(fn([1, 2, 3])).returns(23);

    expect(instance(fn)([1, 2, 3])).toEqual(23);
  });

  it('should match arrays', () => {
    const fn = mock<(foo: number[]) => number>();

    when(fn([1, 2, 3])).returns(23);

    expect(instance(fn)([1, 2, 3])).toEqual(23);
  });

  it('should match sets', () => {
    const fn = mock<(foo: Set<number>) => number>();

    when(fn(new Set([1, 2, 3]))).returns(23);

    expect(instance(fn)(new Set([1, 2, 3]))).toEqual(23);
  });

  it('should match maps', () => {
    const fn = mock<(foo: Map<number, boolean>) => number>();

    when(
      fn(
        new Map([
          [1, true],
          [2, false]
        ])
      )
    ).returns(23);

    expect(
      instance(fn)(
        new Map([
          [1, true],
          [2, false]
        ])
      )
    ).toEqual(23);
  });

  it('should match optional args against undefined', () => {
    const fn = mock<(x?: number) => number>();

    when(fn(undefined)).returns(23);

    expect(instance(fn)()).toEqual(23);
  });

  it('should throw for expected optional arg', () => {
    const fn = mock<(x?: number) => number>();

    when(fn(23)).returns(23);

    expect(() => instance(fn)()).toThrow(UnexpectedCall);
  });

  it('should match passed in optional args', () => {
    const fn = mock<(x?: number) => number>();

    when(fn()).returns(23);

    expect(instance(fn)(42)).toEqual(23);
  });

  it('should throw for expected undefined optional arg', () => {
    const fn = mock<(x?: number) => number>();

    when(fn(undefined)).returns(23);

    expect(() => instance(fn)(42)).toThrow(UnexpectedCall);
  });
});
