import { It } from '../expectation/it';
import type { MockOptions } from './options';
import { UnexpectedProperty } from './options';

export type StrongMockDefaults = Required<MockOptions>;

const defaults: StrongMockDefaults = {
  concreteMatcher: It.deepEquals,
  unexpectedProperty: UnexpectedProperty.CALL_THROW,
  exactParams: false,
};

export let currentDefaults: StrongMockDefaults = defaults;

/**
 * Override strong-mock's defaults.
 *
 * @param newDefaults These will be applied to the library defaults. Multiple
 *   calls don't stack e.g. calling this with `{}` will clear any previously
 *   applied defaults.
 */
export const setDefaults = (newDefaults: MockOptions): void => {
  currentDefaults = {
    ...defaults,
    ...newDefaults,
  };
};
