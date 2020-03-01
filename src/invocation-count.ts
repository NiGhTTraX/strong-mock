import { Expectation } from './expectation';

export interface InvocationCount {
  /**
   * `min` and `max` are inclusive.
   */
  between(min: number, max: number): void;

  /**
   * Shortcut for `between(exact, exact)`.
   */
  times(exact: number): void;

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

export class ExpectationInvocationCount implements InvocationCount {
  constructor(private expectation: Expectation) {}

  /* eslint-disable no-param-reassign, no-multi-assign */
  between(min: number, max: number) {
    this.expectation.min = min;
    this.expectation.max = max;
  }

  /* istanbul ignore next */
  times(exact: number) {
    this.expectation.min = this.expectation.max = exact;
  }

  /* istanbul ignore next */
  atLeast(min: number) {
    this.expectation.min = min;
    this.expectation.max = Infinity;
  }

  /* istanbul ignore next */
  atMost(max: number) {
    this.expectation.min = 0;
    this.expectation.max = max;
  }

  /* istanbul ignore next */
  once() {
    this.expectation.min = this.expectation.max = 1;
  }

  /* istanbul ignore next */
  twice() {
    this.expectation.min = this.expectation.max = 2;
  }
  /* eslint-enable no-param-reassign, no-multi-assign */
}

export const returnInvocationCount = (
  expectation: Expectation
): InvocationCount => new ExpectationInvocationCount(expectation);
