import { describe, expect, it } from 'vitest';
import { UnexpectedAccess } from '../errors/unexpected-access.js';
import { matches } from '../matchers/matcher.js';
import { when } from '../when/when.js';
import { mock } from './mock.js';
import { UnexpectedProperty } from './options.js';

describe('mockName', () => {
  it('should override concrete matcher', () => {
    const fn = mock<(value: string) => boolean>({
      concreteMatcher: () => matches(() => true),
    });

    when(() => fn('value')).thenReturn(true);

    expect(fn('not-value')).toBeTruthy();
  });

  it('should override unexpectedProperty', () => {
    const foo = mock<{ bar: () => number }>({
      unexpectedProperty: UnexpectedProperty.THROW,
    });

    expect(() => foo.bar()).toThrow(UnexpectedAccess);
  });
});
