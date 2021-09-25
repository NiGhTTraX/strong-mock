import { deepEquals, Matcher } from '../expectation/matcher';

export type StrongMockDefaults = {
  /**
   * The matcher that will be used when one isn't specified explicitly.
   *
   * @param expected The non matcher expected value.
   *
   * @example
   * StrongMock.setDefaults({
   *   matcher: () => It.matches(() => true)
   * });
   *
   * when(fn('value')).thenReturn(true);
   *
   * instance(fn('not-value')) === true;
   */
  matcher: <T>(expected: T) => Matcher;
};

const defaults: StrongMockDefaults = {
  matcher: deepEquals,
};

export let currentDefaults: StrongMockDefaults = defaults;

/**
 * Override strong-mock's defaults.
 *
 * @param newDefaults These will be applied to the library defaults. Multiple
 *   calls don't stack e.g. calling this with `{}` will clear any previously
 *   applied defaults.
 */
export const setDefaults = (newDefaults: Partial<StrongMockDefaults>): void => {
  currentDefaults = {
    ...defaults,
    ...newDefaults,
  };
};
