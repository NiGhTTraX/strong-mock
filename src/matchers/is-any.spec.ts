import { describe, expect, it } from 'vitest';
import { isAny } from './is-any.js';

describe('isAny', () => {
  it('should match null', () => {
    expect(isAny().matches(null)).toBeTruthy();
  });

  it('should match undefined', () => {
    expect(isAny().matches(undefined)).toBeTruthy();
  });

  it('should match strings', () => {
    expect(isAny().matches('foobar')).toBeTruthy();
  });

  it('should match numbers', () => {
    expect(isAny().matches(23)).toBeTruthy();
  });

  it('should match booleans', () => {
    expect(isAny().matches(true)).toBeTruthy();
  });

  it('should match objects', () => {
    expect(isAny().matches({ foo: 'bar' })).toBeTruthy();
  });

  it('should match arrays', () => {
    expect(isAny().matches([1, 2, 3])).toBeTruthy();
  });

  it('should pretty print', () => {
    expect(isAny().toString()).toEqual('Matcher<any>');
  });

  it('should return diff', () => {
    expect(isAny().getDiff(42)).toEqual({ actual: 42, expected: 42 });
  });
});
