import { describe, expect, it } from 'vitest';
import { expectAnsilessEqual } from '../../tests/ansiless.js';
import { SM } from '../../tests/old.js';
import type { Property } from '../proxy.js';
import { containsObject } from './contains-object.js';
import { isArray } from './is-array.js';
import { isString } from './is-string.js';
import type { MatcherDiffer } from './matcher.js';
import { matches } from './matcher.js';

const expectDiff = ({
  expected,
  actual,
  expectedDiff,
  actualDiff,
}: {
  expected: Record<Property, unknown>;
  actual: unknown;
  expectedDiff: Record<Property, unknown>;
  actualDiff: unknown;
}) => {
  expect(containsObject(expected).matches(actual)).toBeFalsy();
  expect(containsObject(expected).getDiff(actual)).toEqual({
    actual: actualDiff,
    expected: expectedDiff,
  });
};

type Test = {
  expected: Record<Property, unknown>;
  actual: unknown;
  expectedDiff: Record<Property, unknown>;
  actualDiff: unknown;
};

const diffTests = (tests: Test[]) => {
  tests.forEach((test) =>
    expectDiff({
      expected: test.expected,
      actual: test.actual,
      expectedDiff: test.expectedDiff,
      actualDiff: test.actualDiff,
    }),
  );
};

describe('containsObject', () => {
  it('should match a subset of the actual keys', () => {
    expect(containsObject({ foo: 'bar' }).matches({ foo: 'bar' })).toBeTruthy();
    expect(
      containsObject({ foo: 'bar' }).matches({ foo: 'bar', extra: 1 }),
    ).toBeTruthy();
    expect(
      containsObject({ one: 1, two: 2 }).matches({ one: 1, two: 2 }),
    ).toBeTruthy();
    expect(
      containsObject({ one: 1, two: 2 }).matches({ one: 1, two: 2, three: 3 }),
    ).toBeTruthy();

    diffTests([
      {
        expected: { foo: 'bar' },
        actual: { foo: 'not bar' },
        expectedDiff: { foo: 'bar' },
        actualDiff: { foo: 'not bar' },
      },
      {
        expected: { foo: 'bar' },
        actual: { foo: 'foobar' },
        expectedDiff: { foo: 'bar' },
        actualDiff: { foo: 'foobar' },
      },
      {
        expected: { one: 1, two: 2 },
        actual: { one: 1, two: 'not 2', three: 3 },
        expectedDiff: { one: 1, two: 2 },
        actualDiff: { one: 1, two: 'not 2' },
      },
      {
        expected: { foo: 'bar' },
        actual: {},
        expectedDiff: { foo: 'bar' },
        actualDiff: { foo: undefined },
      },
      {
        expected: { foo: 'bar' },
        actual: 'not object',
        expectedDiff: { foo: 'bar' },
        actualDiff: 'not object',
      },
      {
        expected: { foo: { bar: 'baz' } },
        actual: { foo: 'not object' },
        expectedDiff: { foo: { bar: 'baz' } },
        actualDiff: { foo: 'not object' },
      },
    ]);
  });

  it('should handle falsy values', () => {
    expect(containsObject({ foo: false }).matches({ foo: false })).toBeTruthy();
    expect(containsObject({ foo: null }).matches({ foo: null })).toBeTruthy();
    expect(
      containsObject({ foo: undefined }).matches({ foo: undefined }),
    ).toBeTruthy();
    expect(containsObject({ foo: '' }).matches({ foo: '' })).toBeTruthy();

    diffTests([
      {
        expected: { foo: 'defined' },
        actual: { foo: undefined },
        expectedDiff: { foo: 'defined' },
        actualDiff: { foo: undefined },
      },
      {
        expected: { foo: undefined },
        actual: { foo: 'defined' },
        expectedDiff: { foo: undefined },
        actualDiff: { foo: 'defined' },
      },
      {
        expected: { foo: 'notnull' },
        actual: { foo: null },
        expectedDiff: { foo: 'notnull' },
        actualDiff: { foo: null },
      },
      {
        expected: { foo: null },
        actual: { foo: 'notnull' },
        expectedDiff: { foo: null },
        actualDiff: { foo: 'notnull' },
      },
      {
        expected: { foo: false },
        actual: { foo: '' },
        expectedDiff: { foo: false },
        actualDiff: { foo: '' },
      },
      {
        expected: { foo: '' },
        actual: { foo: false },
        expectedDiff: { foo: '' },
        actualDiff: { foo: false },
      },
    ]);
  });

  it('should match non string keys', () => {
    const foo = Symbol('foo');

    expect(
      containsObject({ [foo]: 'bar' }).matches({ [foo]: 'bar' }),
    ).toBeTruthy();
    expect(containsObject({ 100: 'bar' }).matches({ 100: 'bar' })).toBeTruthy();

    diffTests([
      {
        expected: { [foo]: 'bar' },
        actual: { [foo]: 'baz' },
        expectedDiff: { [foo]: 'bar' },
        actualDiff: { [foo]: 'baz' },
      },
      {
        expected: { 100: 'bar' },
        actual: { 100: 'baz' },
        expectedDiff: { 100: 'bar' },
        actualDiff: { 100: 'baz' },
      },
    ]);
  });

  it('should match nested keys', () => {
    expect(
      containsObject({ foo: { bar: { baz: 42 } } }).matches({
        foo: { bar: { baz: 42 } },
      }),
    ).toBeTruthy();

    diffTests([
      {
        expected: { foo: { bar: { baz: 'expected' } } },
        actual: { foo: { bar: { baz: 'not expected' } } },
        expectedDiff: { foo: { bar: { baz: 'expected' } } },
        actualDiff: { foo: { bar: { baz: 'not expected' } } },
      },
      {
        expected: { foo: { bar: { baz: 'expected' } } },
        actual: { foo: { bar: { baz: 'not expected' } } },
        expectedDiff: { foo: { bar: { baz: 'expected' } } },
        actualDiff: { foo: { bar: { baz: 'not expected' } } },
      },
    ]);
  });

  it('should handle missing keys', () => {
    diffTests([
      {
        expected: { foo: 42 },
        actual: {},
        expectedDiff: { foo: 42 },
        actualDiff: {},
      },
      {
        expected: { foo: { bar: 42 } },
        actual: {},
        expectedDiff: { foo: { bar: 42 } },
        actualDiff: {},
      },
      {
        expected: { foo: { bar: 42 } },
        actual: { foo: {} },
        expectedDiff: { foo: { bar: 42 } },
        actualDiff: { foo: {} },
      },
      {
        expected: { foo: { bar: 42 } },
        actual: { foo: undefined },
        expectedDiff: { foo: { bar: 42 } },
        actualDiff: { foo: undefined },
      },
      {
        expected: { foo: { bar: { baz: 42 } } },
        actual: { foo: { bar: {} } },
        expectedDiff: { foo: { bar: { baz: 42 } } },
        actualDiff: { foo: { bar: {} } },
      },
      {
        expected: { foo: { bar: { baz: 42 } } },
        actual: { foo: { bar: undefined } },
        expectedDiff: { foo: { bar: { baz: 42 } } },
        actualDiff: { foo: { bar: undefined } },
      },
      {
        expected: { foo: { bar: { baz: 42 } } },
        actual: { foo: { bar: false } },
        expectedDiff: { foo: { bar: { baz: 42 } } },
        actualDiff: { foo: { bar: false } },
      },
      {
        expected: { foo: { bar: { baz: 42 } } },
        actual: { foo: { bar: '' } },
        expectedDiff: { foo: { bar: { baz: 42 } } },
        actualDiff: { foo: { bar: '' } },
      },
      {
        expected: { foo: { bar: { baz: 42 } } },
        actual: { foo: { bar: 'bla' } },
        expectedDiff: { foo: { bar: { baz: 42 } } },
        actualDiff: { foo: { bar: 'bla' } },
      },
      {
        expected: { foo: { bar: { baz: 42 } } },
        actual: { foo: undefined },
        expectedDiff: { foo: { bar: { baz: 42 } } },
        actualDiff: { foo: undefined },
      },
      {
        expected: { foo: { bar: { baz: 42 } } },
        actual: undefined,
        expectedDiff: { foo: { bar: { baz: 42 } } },
        actualDiff: undefined,
      },
    ]);
  });

  it('should handle extra keys', () => {
    diffTests([
      {
        expected: { foo: 42 },
        actual: { foo: -1, bar: 2 },
        expectedDiff: { foo: 42 },
        actualDiff: { foo: -1 },
      },
      {
        expected: { foo: { bar: 42 } },
        actual: { foo: { bar: 1, baz: 2 } },
        expectedDiff: { foo: { bar: 42 } },
        actualDiff: { foo: { bar: 1 } },
      },
      {
        expected: { foo: 42 },
        actual: { foo: { bar: 1, baz: 2 } },
        expectedDiff: { foo: 42 },
        actualDiff: { foo: { bar: 1, baz: 2 } },
      },
    ]);
  });

  it('should match object like values', () => {
    const Bar = class {
      foo = 'bar';
    };
    const NotBar = class {
      foo = 'not bar';
    };
    expect(containsObject({ foo: 'bar' }).matches(new Bar())).toBeTruthy();
    diffTests([
      {
        expected: { foo: 'bar' },
        actual: new NotBar(),
        expectedDiff: { foo: 'bar' },
        actualDiff: { foo: 'not bar' },
      },
      {
        expected: { foo: 'not bar' },
        actual: new Bar(),
        expectedDiff: { foo: 'not bar' },
        actualDiff: { foo: 'bar' },
      },
      {
        expected: new NotBar(),
        actual: { foo: 'bar' },
        expectedDiff: { foo: 'not bar' },
        actualDiff: { foo: 'bar' },
      },
      {
        expected: new Bar(),
        actual: { foo: 'not bar' },
        expectedDiff: { foo: 'bar' },
        actualDiff: { foo: 'not bar' },
      },
    ]);

    expect(containsObject({ 0: 'bar' }).matches(['bar'])).toBeTruthy();
    expect(containsObject({ 0: 'bar' }).matches(['bar', 'baz'])).toBeTruthy();
    expect(containsObject({ 0: 0, 2: 2 }).matches([0, 1, 2])).toBeTruthy();
    diffTests([
      {
        expected: { 0: 'bar' },
        actual: ['not bar'],
        expectedDiff: { 0: 'bar' },
        actualDiff: { 0: 'not bar' },
      },
      {
        expected: { 0: 'not bar' },
        actual: ['bar'],
        expectedDiff: { 0: 'not bar' },
        actualDiff: { 0: 'bar' },
      },
      {
        expected: { 0: 0, 1: 1 },
        actual: [0, 2],
        expectedDiff: { 0: 0, 1: 1 },
        actualDiff: { 0: 0, 1: 2 },
      },
    ]);
  });

  it('should not recursively match non plain objects', () => {
    expect(
      containsObject({ foo: [1, 2] }).matches({ foo: [1, 2] }),
    ).toBeTruthy();
    expect(
      containsObject({ foo: new Map([['foo', 'bar']]) }).matches({
        foo: new Map([['foo', 'bar']]),
      }),
    ).toBeTruthy();

    diffTests([
      {
        expected: { foo: [1, 2] },
        actual: { foo: [1, 2, 3] },
        expectedDiff: { foo: [1, 2] },
        actualDiff: { foo: [1, 2, 3] },
      },
      {
        expected: { foo: new Map([['foo', 'bar']]) },
        actual: { foo: { foo: 'bar' } },
        expectedDiff: { foo: new Map([['foo', 'bar']]) },
        actualDiff: { foo: { foo: 'bar' } },
      },
    ]);
  });

  it('should not match if explicit undefined keys are missing', () => {
    diffTests([
      {
        expected: { key: undefined },
        actual: {},
        expectedDiff: { key: undefined },
        actualDiff: {},
      },
      {
        expected: { foo: { bar: undefined } },
        actual: { foo: {} },
        expectedDiff: { foo: { bar: undefined } },
        actualDiff: { foo: {} },
      },
    ]);
  });

  it('should match nested matchers', () => {
    expect(
      containsObject({ foo: isString() }).matches({ foo: 'bar' }),
    ).toBeTruthy();
    expect(
      containsObject({ foo: isArray([isString()]) }).matches({
        foo: ['bar'],
      }),
    ).toBeTruthy();

    const getDiff = SM.mock<MatcherDiffer>();

    SM.when(() => getDiff(23))
      .thenReturn({
        actual: 'a',
        expected: 'e',
      })
      // (Once for the expected diff, and once more for the actual diff) * nr of tests.
      .times(4);

    diffTests([
      {
        expected: {
          foo: matches(() => false, { getDiff }),
        },
        actual: { foo: 23 },
        expectedDiff: { foo: 'e' },
        actualDiff: { foo: 'a' },
      },
      {
        expected: {
          foo: { bar: matches(() => false, { getDiff }) },
        },
        actual: { foo: { bar: 23 } },
        expectedDiff: { foo: { bar: 'e' } },
        actualDiff: { foo: { bar: 'a' } },
      },
    ]);
  });

  it('should handle non string keys when matching nested matchers', () => {
    const matcher = matches(() => false, {
      getDiff: () => ({ actual: 'a', expected: 'e' }),
    });
    const foo = Symbol('foo');

    diffTests([
      {
        expected: {
          [foo]: matcher,
        },
        actual: { [foo]: 'actual' },
        expectedDiff: { [foo]: 'e' },
        actualDiff: { [foo]: 'a' },
      },
    ]);
  });

  describe('print', () => {
    it('should pretty print the partial object', () => {
      expectAnsilessEqual(
        containsObject({ foo: 'bar' }).toString(),
        `Matcher<object>({"foo": "bar"})`,
      );
    });

    it('should pretty print the partial object when it contains matchers', () => {
      const matcher = matches(() => false, { toString: () => 'matcher' });

      expectAnsilessEqual(
        containsObject({
          foo: matcher,
        }).toString(),
        `Matcher<object>({"foo": "matcher"})`,
      );

      expectAnsilessEqual(
        containsObject({
          foo: { bar: matcher },
        }).toString(),
        `Matcher<object>({"foo": {"bar": "matcher"}})`,
      );
    });
  });
});
