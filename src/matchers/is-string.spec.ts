import { expectAnsilessEqual } from '../../tests/ansiless';

import { It } from './it';

describe('isString', () => {
  it('should match any string', () => {
    expect(It.isString().matches('foobar')).toBeTruthy();
  });

  it('should match the empty string', () => {
    expect(It.isString().matches('')).toBeTruthy();
  });

  it('should not match numbers', () => {
    expect(It.isString().matches(10e2)).toBeFalsy();
  });

  it('should match a string based on the given pattern', () => {
    expect(It.isString({ matching: /foo/ }).matches('foo')).toBeTruthy();
    expect(It.isString({ matching: /foo/ }).matches('bar')).toBeFalsy();
  });

  it('should match a string containing the given substring', () => {
    expect(It.isString({ containing: 'foo' }).matches('foobar')).toBeTruthy();
    expect(It.isString({ containing: 'baz' }).matches('foobar')).toBeFalsy();
  });

  it('should throw if more than one pattern given', () => {
    expect(() => It.isString({ matching: /foo/, containing: 'bar' })).toThrow();
  });

  it('should pretty print', () => {
    expectAnsilessEqual(It.isString().toJSON(), 'string');
    expectAnsilessEqual(
      It.isString({ containing: 'foo' }).toJSON(),
      "string('foo')"
    );
    expectAnsilessEqual(
      It.isString({ matching: /bar/ }).toJSON(),
      'string(/bar/)'
    );
  });

  it('should return diff', () => {
    expect(It.isString().getDiff(42)).toEqual({
      actual: '42 (number)',
      expected: 'string',
    });

    expect(It.isString({ containing: 'foo' }).getDiff(42)).toEqual({
      actual: 42,
      expected: "string containing 'foo'",
    });

    expect(It.isString({ containing: 'foo' }).getDiff('bar')).toEqual({
      actual: 'bar',
      expected: "string containing 'foo'",
    });

    expect(It.isString({ matching: /foo/ }).getDiff('bar')).toEqual({
      actual: 'bar',
      expected: 'string matching /foo/',
    });
  });
});
