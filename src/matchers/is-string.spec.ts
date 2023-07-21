import { expectAnsilessEqual } from '../../tests/ansiless';
import { isString } from './is-string';

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
    expect(isString({ matching: /foo/ }).matches('foo')).toBeTruthy();
    expect(isString({ matching: /foo/ }).matches('bar')).toBeFalsy();
  });

  it('should match a string containing the given substring', () => {
    expect(isString({ containing: 'foo' }).matches('foobar')).toBeTruthy();
    expect(isString({ containing: 'baz' }).matches('foobar')).toBeFalsy();
  });

  it('should throw if more than one pattern given', () => {
    expect(() => isString({ matching: /foo/, containing: 'bar' })).toThrow();
  });

  it('should pretty print', () => {
    expectAnsilessEqual(isString().toJSON(), 'string');
    expectAnsilessEqual(
      isString({ containing: 'foo' }).toJSON(),
      "string('foo')"
    );
    expectAnsilessEqual(
      isString({ matching: /bar/ }).toJSON(),
      'string(/bar/)'
    );
  });

  it('should return diff', () => {
    expect(isString().getDiff(42)).toEqual({
      actual: '42 (number)',
      expected: 'string',
    });

    expect(isString({ containing: 'foo' }).getDiff(42)).toEqual({
      actual: 42,
      expected: "string containing 'foo'",
    });

    expect(isString({ containing: 'foo' }).getDiff('bar')).toEqual({
      actual: 'bar',
      expected: "string containing 'foo'",
    });

    expect(isString({ matching: /foo/ }).getDiff('bar')).toEqual({
      actual: 'bar',
      expected: 'string matching /foo/',
    });
  });
});
