import type { Matcher, TypeMatcher } from './matcher';
import { MATCHER_SYMBOL } from './matcher';

/**
 * Matches anything and stores the received value.
 *
 * This should not be needed for most cases, but can be useful if you need
 * access to a complex argument outside the expectation e.g. to test a
 * callback.
 *
 * @param name If given, this name will be printed in error messages.
 *
 * @example
 * const fn = mock<(cb: (value: number) => number) => void>();
 * const matcher = It.willCapture();
 * when(() => fn(matcher)).thenReturn();
 *
 * fn(x => x + 1);
 * matcher.value?.(3) === 4
 */
export const willCapture = <T = unknown>(
  name?: string
): TypeMatcher<T> & {
  value: T | undefined;
} => {
  let capturedValue: T | undefined;

  const matcher: Matcher & {
    value: T | undefined;
  } = {
    [MATCHER_SYMBOL]: true,
    matches: (actual) => {
      capturedValue = actual;

      return true;
    },
    toString: () => name ?? 'Matcher(captures)',
    getDiff: (actual) => ({
      actual,
      expected: actual,
    }),
    get value(): T | undefined {
      return capturedValue;
    },
  };

  return matcher as any;
};
