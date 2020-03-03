import { Expectation } from './expectation';

export interface InvocationCount {
  /**
   * Expect a call to be made at least `min` times and at most `max` times.
   */
  between(min: number, max: number): void;

  /**
   * Shortcut for `between(exact, exact)`.
   */
  times(exact: number): void;

  /**
   * Shortcut for `between(0, Infinity)`.
   */
  anyTimes(): void;

  /**
   * Shortcut for `between(min, Infinity)`.
   */
  atLeast(min: number): void;

  /**
   * Shortcut for `between(0, max)`.
   */
  atMost(max: number): void;

  /**
   * Shortcut for `times(1)`.
   */
  once(): void;

  /**
   * Shortcut for `times(2)`.
   */
  twice(): void;
}

export const createInvocationCount = (
  expectation: Expectation
): InvocationCount => ({
  /* eslint-disable no-param-reassign, no-multi-assign */
  between(min: number, max: number) {
    expectation.min = min;
    expectation.max = max;
  },

  /* istanbul ignore next */
  times(exact: number) {
    expectation.min = expectation.max = exact;
  },

  /* istanbul ignore next */
  anyTimes(): void {
    expectation.min = 0;
    expectation.max = 0;
  },

  /* istanbul ignore next */
  atLeast(min: number) {
    expectation.min = min;
    expectation.max = Infinity;
  },

  /* istanbul ignore next */
  atMost(max: number) {
    expectation.min = 0;
    expectation.max = max;
  },

  /* istanbul ignore next */
  once() {
    expectation.min = expectation.max = 1;
  },

  /* istanbul ignore next */
  twice() {
    expectation.min = expectation.max = 2;
  }
  /* eslint-enable no-param-reassign, no-multi-assign */
});
