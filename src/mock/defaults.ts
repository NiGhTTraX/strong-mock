import { It } from '../expectation/it';
import { Matcher } from '../expectation/matcher';
import { Strictness } from '../expectation/repository/flexible-repository';

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
   * when(() => fn('value')).thenReturn(true);
   *
   * fn('not-value') === true;
   */
  matcher: <T>(expected: T) => Matcher;

  /**
   * Controls what happens when a property is accessed, or a call is made,
   * and there are no expectations set for it.
   */
  strictness: Strictness;
};

const defaults: StrongMockDefaults = {
  matcher: It.deepEquals,
  strictness: Strictness.STRICT,
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
