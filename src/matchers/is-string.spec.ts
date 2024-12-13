import { describe, expect, it } from 'vitest';
import { expectAnsilessEqual } from '../../tests/ansiless.js';
import { isString } from './is-string.js';

describe('isString', () => {
  it('should match any string', () => {
    expect(isString().matches('foobar')).toBeTruthy();
  });

  it('should match the empty string', () => {
    expect(isString().matches('')).toBeTruthy();
  });

  it('should not match numbers', () => {
    expect(isString().matches(10e2)).toBeFalsy();
  });

  it('should match a string based on the given pattern', () => {
    expect(isString(/foo/).matches('foo')).toBeTruthy();
    expect(isString(/foo/).matches('bar')).toBeFalsy();
  });

  it('should match a string containing the given substring', () => {
    expect(isString('foo').matches('foobar')).toBeTruthy();
    expect(isString('baz').matches('foobar')).toBeFalsy();
  });

  it('should pretty print', () => {
    expectAnsilessEqual(isString().toString(), 'Matcher<string>');
    expectAnsilessEqual(isString('foo').toString(), 'Matcher<string>(foo)');
    expectAnsilessEqual(isString(/bar/).toString(), 'Matcher<string>(/bar/)');
  });

  it('should return diff', () => {
    expect(isString().getDiff(42)).toEqual({
      actual: '42 (number)',
      expected: 'Matcher<string>',
    });

    expect(isString('foo').getDiff(42)).toEqual({
      actual: 42,
      expected: 'Matcher<string>(foo)',
    });

    expect(isString('foo').getDiff('bar')).toEqual({
      actual: 'bar',
      expected: 'Matcher<string>(foo)',
    });

    expect(isString(/foo/).getDiff('bar')).toEqual({
      actual: 'bar',
      expected: 'Matcher<string>(/foo/)',
    });
  });
});
