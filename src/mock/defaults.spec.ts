import { instance, It, when } from '../index';
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

    expect(instance(fn)(-1)).toBeTruthy();
  });

  it('should not override the matcher for matcher values', () => {
    setDefaults({
      matcher: () => It.matches(() => true),
    });

    const fn = mock<(x: number) => boolean>();

    when(() => fn(It.matches((x) => x === 1))).thenReturn(true);

    expect(() => instance(fn)(-1)).toThrow();
  });

  it('should not stack', () => {
    setDefaults({
      matcher: () => It.matches(() => true),
    });

    setDefaults({});

    const fn = mock<(x: number) => boolean>();

    when(() => fn(1)).thenReturn(true);

    expect(() => instance(fn)(-1)).toThrow();
  });
});
