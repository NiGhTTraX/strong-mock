import { describe, expect, it } from 'vitest';
import { expectAnsilessEqual } from '../../tests/ansiless.js';
import { is } from './is.js';

describe('is', () => {
  it('should compare primitives', () => {
    expect(is(42).matches(42)).toBeTruthy();
    expect(is(42).matches(0)).toBeFalsy();
    expect(is('foo').matches('foo')).toBeTruthy();
    expect(is('foo').matches('bar')).toBeFalsy();
    expect(is(true).matches(true)).toBeTruthy();
    expect(is(true).matches(false)).toBeFalsy();
  });

  it('should compare arrays by reference', () => {
    const arr = [1, 2, 3];
    expect(is(arr).matches(arr)).toBeTruthy();
    expect(is(arr).matches([1, 2, 3])).toBeFalsy();
  });

  it('should compare objects by reference', () => {
    const obj = { foo: 'bar' };
    expect(is(obj).matches(obj)).toBeTruthy();
    expect(is(obj).matches({ foo: 'bar' })).toBeFalsy();
  });

  it('should compare +0 and -0', () => {
    expect(is(+0).matches(-0)).toBeFalsy();
    expect(is(-0).matches(-0)).toBeTruthy();
  });

  it('should compare NaN', () => {
    expect(is(NaN).matches(0 / 0)).toBeTruthy();
    expect(is(NaN).matches(Number.NaN)).toBeTruthy();
  });

  it('should pretty print', () => {
    expectAnsilessEqual(is(23).toString(), '23');
    expectAnsilessEqual(
      is({ foo: { bar: [1, 2, 3] } }).toString(),
      '{"foo": {"bar": [1, 2, 3]}}',
    );
  });

  it('should return diff', () => {
    expect(is(42).getDiff(-1)).toEqual({
      expected: 42,
      actual: -1,
    });

    expect(is({ foo: 'bar' }).getDiff('baz')).toEqual({
      expected: { foo: 'bar' },
      actual: 'baz',
    });
  });
});
