import { Expectation } from '../expectation/expectation';

export interface InvocationCount {
  /**
   * Expect a call to be made at least `min` times and at most `max` times.
   */
  between(min: number, max: number): void;

  /**
   * Expect a call to be made exactly `exact` times.
   *
   * Shortcut for `between(exact, exact)`.
   */
  times(exact: number): void;

  /**
   * Expect a call to be made any number of times, including never.
   *
   * Shortcut for `between(0, Infinity)`.
   */
  anyTimes(): void;

  /**
   * Expect a call to be made at least `min` times.
   *
   * Shortcut for `between(min, Infinity)`.
   */
  atLeast(min: number): void;

  /**
   * Expect a call to be made at most `max` times.
   *
   * Shortcut for `between(0, max)`.
   */
  atMost(max: number): void;

  /**
   * Expect a call to be made exactly once.
   *
   * Shortcut for `times(1)`.
   */
  once(): void;

  /**
   * Expect a call to be made exactly twice.
   *
   * Shortcut for `times(2)`.
   */
  twice(): void;
}

export const createInvocationCount = (
  expectation: Expectation
): InvocationCount => ({
  between(min: number, max: number) {
    expectation.setInvocationCount(min, max);
  },

  /* istanbul ignore next */
  times(exact: number) {
    expectation.setInvocationCount(exact, exact);
  },

  /* istanbul ignore next */
  anyTimes(): void {
    expectation.setInvocationCount(0, 0);
  },

  /* istanbul ignore next */
  atLeast(min: number) {
    expectation.setInvocationCount(min, Infinity);
  },

  /* istanbul ignore next */
  atMost(max: number) {
    expectation.setInvocationCount(0, max);
  },

  /* istanbul ignore next */
  once() {
    expectation.setInvocationCount(1, 1);
  },

  /* istanbul ignore next */
  twice() {
    expectation.setInvocationCount(2, 2);
  },
  /* eslint-enable no-param-reassign, no-multi-assign */
});
