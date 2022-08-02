import { UnexpectedAccess } from '../errors';
import { It } from '../expectation/it';
import { when } from '../when/when';
import { mock } from './mock';
import { Strictness } from './options';

describe('mock', () => {
  it('should override concrete matcher', () => {
    const fn = mock<(value: string) => boolean>({
      concreteMatcher: () => It.matches(() => true),
    });

    when(() => fn('value')).thenReturn(true);

    expect(fn('not-value')).toBeTruthy();
  });

  it('should override strictness', () => {
    const foo = mock<{ bar: () => number }>({
      strictness: Strictness.SUPER_STRICT,
    });

    expect(() => foo.bar()).toThrow(UnexpectedAccess);
  });
});
