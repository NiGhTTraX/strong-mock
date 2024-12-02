import { beforeEach, describe, expect, it } from 'vitest';
import { UnexpectedAccess } from '../errors/unexpected-access';
import { UnexpectedCall } from '../errors/unexpected-call';
import { when } from '../index';
import { matches } from '../matchers/matcher';
import { setDefaults } from './defaults';
import { mock } from './mock';
import { UnexpectedProperty } from './options';

describe('defaults', () => {
  beforeEach(() => {
    setDefaults({});
  });

  it('should override the matcher for non matcher values', () => {
    setDefaults({
      concreteMatcher: () => matches(() => true),
    });

    const fn = mock<(x: number) => boolean>();

    when(() => fn(1)).thenReturn(true);

    expect(fn(-1)).toBeTruthy();
  });

  it('should not override the matcher for matcher values', () => {
    setDefaults({
      concreteMatcher: () => matches(() => true),
    });

    const fn = mock<(x: number) => boolean>();

    when(() => fn(matches((x) => x === 1))).thenReturn(true);

    expect(() => fn(-1)).toThrow();
  });

  it('should not override the matcher if set on the mock', () => {
    setDefaults({
      concreteMatcher: () => matches(() => false),
    });

    const fn = mock<(x: number) => boolean>({
      concreteMatcher: () => matches(() => true),
    });

    when(() => fn(42)).thenReturn(true);

    expect(fn(-1)).toBeTruthy();
  });

  it('should override the unexpectedProperty option', () => {
    setDefaults({
      unexpectedProperty: UnexpectedProperty.THROW,
    });

    const foo = mock<{ bar: () => number }>();

    expect(() => foo.bar()).toThrow(UnexpectedAccess);
  });

  it('should not override the unexpectedProperty option if set on the mock', () => {
    setDefaults({
      unexpectedProperty: UnexpectedProperty.THROW,
    });

    const foo = mock<{ bar: () => number }>({
      unexpectedProperty: UnexpectedProperty.CALL_THROW,
    });

    expect(() => foo.bar()).toThrow(UnexpectedCall);
  });

  it('should not stack', () => {
    setDefaults({
      concreteMatcher: () => matches(() => true),
    });

    setDefaults({});

    const fn = mock<(x: number) => boolean>();

    when(() => fn(1)).thenReturn(true);

    expect(() => fn(-1)).toThrow();
  });
});
