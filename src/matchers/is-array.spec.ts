import { expectAnsilessEqual } from '../../tests/ansiless';
import { isArray } from './is-array';
import { isPartial } from './is-partial';
import { isString } from './is-string';
import { matches } from './matcher';

describe('isArray', () => {
  it('should match an empty array', () => {
    expect(isArray().matches([])).toBeTruthy();
  });

  it('should not match array likes', () => {
    expect(isArray().matches({ length: 0 })).toBeFalsy();
    expect(isArray().matches(new Set([1, 2, 3]))).toBeFalsy();
  });

  it('should match a non-empty array', () => {
    expect(isArray().matches([1, '2', true, {}])).toBeTruthy();
  });

  it('should match an array containing an empty array', () => {
    expect(isArray([]).matches([1, '2', true, {}])).toBeTruthy();
    expect(isArray([]).matches([])).toBeTruthy();
  });

  it('should match arrays that include the given sub-array', () => {
    expect(isArray([2, 3]).matches([1, 2, 3, 4])).toBeTruthy();
    expect(isArray([2, 3]).matches([3, 4])).toBeFalsy();
    expect(isArray([1, 2]).matches([1, 2, 3, 4])).toBeTruthy();
    expect(isArray([1, 2]).matches([2])).toBeFalsy();
    expect(isArray([3, 4]).matches([1, 2, 3, 4])).toBeTruthy();
    expect(isArray([1, 2, 3, 4]).matches([1, 2, 3, 4])).toBeTruthy();
  });

  it('should match arrays that includes all elements in the given array, in any order', () => {
    expect(isArray([1, 2, 3]).matches([3, 2, 1])).toBeTruthy();
    expect(isArray([3, 2, 1]).matches([1, 1, 2, 2, 3, 3])).toBeTruthy();
  });

  it('should match arrays of objects', () => {
    expect(
      isArray([{ foo: 'bar' }]).matches([{ foo: 'bar' }, { foo: 'baz' }])
    ).toBeTruthy();
    expect(
      isArray([{ foo: 'boo' }]).matches([{ foo: 'bar' }, { foo: 'baz' }])
    ).toBeFalsy();
  });

  it('should match nested matchers', () => {
    expect(
      isArray([isString(), isPartial({ foo: 'bar' })]).matches([
        'foo',
        { foo: 'bar' },
      ])
    ).toBeTruthy();

    expect(isArray([isString('foobar')]).matches(['foo'])).toBeFalsy();
  });

  it('should pretty print', () => {
    expectAnsilessEqual(isArray().toString(), 'array');
    expectAnsilessEqual(isArray([1, 2, 3]).toString(), 'array([1, 2, 3])');
  });

  it('should print diff', () => {
    expect(isArray().getDiff(42)).toEqual({
      expected: 'Matcher<array>',
      actual: '42 (number)',
    });

    expect(isArray().getDiff({ foo: 'bar' })).toEqual({
      expected: 'Matcher<array>',
      actual: '{"foo": "bar"} (object)',
    });

    expect(isArray([1, 2]).getDiff(42)).toEqual({
      expected: 'Matcher<array>([1, 2])',
      actual: 42,
    });

    expect(isArray([1, 2]).getDiff([2])).toEqual({
      expected: 'Matcher<array>([1, 2])',
      actual: [2],
    });
  });

  it('should print diff with stringified nested matchers', () => {
    const matcher = matches(() => false, {
      toString: () => 'something',
      getDiff: () => {
        throw new Error();
      },
    });

    expect(isArray([matcher, matcher]).getDiff([2])).toEqual({
      expected: 'Matcher<array>([something, something])',
      actual: [2],
    });
  });
});
