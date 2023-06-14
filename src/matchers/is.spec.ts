import { expectAnsilessEqual } from '../../tests/ansiless';

import { It } from './it';

describe('is', () => {
  it('should compare primitives', () => {
    expect(It.is(42).matches(42)).toBeTruthy();
    expect(It.is(42).matches(0)).toBeFalsy();
    expect(It.is('foo').matches('foo')).toBeTruthy();
    expect(It.is('foo').matches('bar')).toBeFalsy();
    expect(It.is(true).matches(true)).toBeTruthy();
    expect(It.is(true).matches(false)).toBeFalsy();
  });

  it('should compare arrays by reference', () => {
    const arr = [1, 2, 3];
    expect(It.is(arr).matches(arr)).toBeTruthy();
    expect(It.is(arr).matches([1, 2, 3])).toBeFalsy();
  });

  it('should compare objects by reference', () => {
    const obj = { foo: 'bar' };
    expect(It.is(obj).matches(obj)).toBeTruthy();
    expect(It.is(obj).matches({ foo: 'bar' })).toBeFalsy();
  });

  it('should compare +0 and -0', () => {
    expect(It.is(+0).matches(-0)).toBeFalsy();
    expect(It.is(-0).matches(-0)).toBeTruthy();
  });

  it('should compare NaN', () => {
    expect(It.is(NaN).matches(0 / 0)).toBeTruthy();
    expect(It.is(NaN).matches(Number.NaN)).toBeTruthy();
  });

  it('should pretty print', () => {
    expectAnsilessEqual(It.is(23).toJSON(), '23');
    expectAnsilessEqual(
      It.is({ foo: { bar: [1, 2, 3] } }).toJSON(),
      '{"foo": {"bar": [1, 2, 3]}}'
    );
  });
});
