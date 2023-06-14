import { UnexpectedAccess } from '../errors/unexpected-access';
import { It } from '../expectation/it';
import { when } from '../when/when';
import { mock } from './mock';
import { UnexpectedProperty } from './options';

describe('mock', () => {
  it('should override concrete matcher', () => {
    const fn = mock<(value: string) => boolean>({
      concreteMatcher: () => It.matches(() => true),
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
