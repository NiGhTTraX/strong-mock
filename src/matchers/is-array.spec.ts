import { expectAnsilessEqual } from '../../tests/ansiless';

import { It } from './it';

describe('isArray', () => {
  it('should match an empty array', () => {
    expect(It.isArray().matches([])).toBeTruthy();
  });

  it('should not match array likes', () => {
    expect(It.isArray().matches({ length: 0 })).toBeFalsy();
    expect(It.isArray().matches(new Set([1, 2, 3]))).toBeFalsy();
  });

  it('should match a non-empty array', () => {
    expect(It.isArray().matches([1, '2', true, {}])).toBeTruthy();
  });

  it('should match an array containing an empty array', () => {
    expect(It.isArray([]).matches([1, '2', true, {}])).toBeTruthy();
    expect(It.isArray([]).matches([])).toBeTruthy();
  });

  it('should match arrays that include the given sub-array', () => {
    expect(It.isArray([2, 3]).matches([1, 2, 3, 4])).toBeTruthy();
    expect(It.isArray([2, 3]).matches([3, 4])).toBeFalsy();
    expect(It.isArray([1, 2]).matches([1, 2, 3, 4])).toBeTruthy();
    expect(It.isArray([1, 2]).matches([2])).toBeFalsy();
    expect(It.isArray([3, 4]).matches([1, 2, 3, 4])).toBeTruthy();
    expect(It.isArray([1, 2, 3, 4]).matches([1, 2, 3, 4])).toBeTruthy();
  });

  it('should match arrays that includes all elements in the given array, in any order', () => {
    expect(It.isArray([1, 2, 3]).matches([3, 2, 1])).toBeTruthy();
    expect(It.isArray([3, 2, 1]).matches([1, 1, 2, 2, 3, 3])).toBeTruthy();
  });

  it('should match arrays of objects', () => {
    expect(
      It.isArray([{ foo: 'bar' }]).matches([{ foo: 'bar' }, { foo: 'baz' }])
    ).toBeTruthy();
    expect(
      It.isArray([{ foo: 'boo' }]).matches([{ foo: 'bar' }, { foo: 'baz' }])
    ).toBeFalsy();
  });

  it('should match nested matchers', () => {
    expect(
      It.isArray([It.isString(), It.isObject({ foo: 'bar' })]).matches([
        'foo',
        { foo: 'bar' },
      ])
    ).toBeTruthy();
    expect(
      It.isArray([It.isString({ containing: 'foobar' })]).matches(['foo'])
    ).toBeFalsy();
  });

  it('should pretty print', () => {
    expectAnsilessEqual(It.isArray().toJSON(), 'array');
    expectAnsilessEqual(It.isArray([1, 2, 3]).toJSON(), 'array([1, 2, 3])');
  });

  it('should print diff', () => {
    expect(It.isArray().getDiff(42)).toEqual({
      expected: 'array',
      actual: '42 (number)',
    });

    expect(It.isArray([1, 2]).getDiff([2])).toEqual({
      expected: 'array containing [1, 2]',
      actual: [2],
    });
  });

  it('should print diff with stringified nested matchers', () => {
    const matcher = It.matches(() => false, {
      toJSON: () => 'something',
      getDiff: () => {
        throw new Error();
      },
    });

    expect(It.isArray([matcher, matcher]).getDiff([2])).toEqual({
      expected: 'array containing [something, something]',
      actual: [2],
    });
  });
});
