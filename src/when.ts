import { SINGLETON_PENDING_EXPECTATION } from './pending-expectation';

interface InvocationCount {
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

interface Stub<T> {
  // TODO: add resolves/rejects
  // TODO; add throws
  returns(returnValue: T): InvocationCount;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
export const when = <R>(expectation: R): Stub<R> => {
  return {
    returns(returnValue: R): InvocationCount {
      const finishedExpectation = SINGLETON_PENDING_EXPECTATION.finish(
        returnValue
      );
      SINGLETON_PENDING_EXPECTATION.clear();

      return {
        between: (min, max) => {
          finishedExpectation.min = min;
          finishedExpectation.max = max;
        },
        times: exact => {
          // eslint-disable-next-line no-multi-assign
          finishedExpectation.min = finishedExpectation.max = exact;
        },
        atLeast(min: number): void {
          finishedExpectation.min = min;
          finishedExpectation.max = Infinity;
        },
        atMost(max: number): void {
          finishedExpectation.min = 0;
          finishedExpectation.max = max;
        },
        once(): void {
          // eslint-disable-next-line no-multi-assign
          finishedExpectation.min = finishedExpectation.max = 1;
        },
        twice(): void {
          // eslint-disable-next-line no-multi-assign
          finishedExpectation.min = finishedExpectation.max = 2;
        }
      };
    }
  };
};
