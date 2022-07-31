import { UnexpectedAccess } from '../errors';
import { Strictness } from '../expectation/repository/strong-repository';
import { It, when } from '../index';
import { setDefaults } from './defaults';
import { mock } from './mock';

describe('defaults', () => {
  beforeEach(() => {
    setDefaults({});
  });

  it('should override the matcher for non matcher values', () => {
    setDefaults({
      matcher: () => It.matches(() => true),
    });

    const fn = mock<(x: number) => boolean>();

    when(() => fn(1)).thenReturn(true);

    expect(fn(-1)).toBeTruthy();
  });

  it('should not override the matcher for matcher values', () => {
    setDefaults({
      matcher: () => It.matches(() => true),
    });

    const fn = mock<(x: number) => boolean>();

    when(() => fn(It.matches((x) => x === 1))).thenReturn(true);

    expect(() => fn(-1)).toThrow();
  });

  it('should override the strictness', () => {
    setDefaults({ strictness: Strictness.SUPER_STRICT });

    const fn = mock<{ foo: () => number }>();

    expect(() => fn.foo()).toThrow(UnexpectedAccess);
  });

  it('should not stack', () => {
    setDefaults({
      matcher: () => It.matches(() => true),
    });

    setDefaults({});

    const fn = mock<(x: number) => boolean>();

    when(() => fn(1)).thenReturn(true);

    expect(() => fn(-1)).toThrow();
  });
});
