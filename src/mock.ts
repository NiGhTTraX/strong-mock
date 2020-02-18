import { isDeepStrictEqual } from 'util';
import {
  UnexpectedAccessError,
  UnexpectedApplyError,
  UnmetApplyExpectationError,
  UnmetMethodExpectationError,
  UnmetPropertyExpectationError,
  WrongApplyArgsError,
  WrongMethodArgsError
} from './errors';
import { isMatcher } from './matcher';
import { MethodExpectation } from './method-expectation';
import { PropertyExpectation } from './property-expectation';

interface StubTimes {
  /**
   * This expectation will never be consumed, unless the mock is reset.
   *
   * `verifyAll` will never throw for this kind of expectation.
   *
   * This is a shortcut for `between(0, Infinity)`.
   */
  anyTimes(): void;

  /**
   * This expectation will be consumed after `exact` invocations.
   *
   * If there are invocations left, `verifyAll` will throw. After the
   * expectation is consumed future invocations will throw.
   */
  times(exact: number): void;

  /**
   * This expectation can be consumed between `min` and `max` times.
   *
   * `verifyAll` will throw if the expectation hasn't been met at least
   * `min` times. After `max` invocations, future invocations will throw.
   */
  between(min: number, max: number): void;
}

// Use a tuple to prevent union distribution, otherwise Stub<T, boolean>
// will resolve to { returns(true & false (actually never) }. See for details:
// https://github.com/microsoft/TypeScript/issues/32645#issuecomment-517102331
export type Stub<T, R> = [R] extends [Promise<infer P>]
  ? {
      /**
       * Resolve to the given value when the expectation is met.
       *
       * @param promiseValue The value the promise will resolve to.
       */
      resolves(promiseValue: P): StubTimes;

      /**
       * Reject with the given error.
       *
       * @param error Either an Error instance or an error message.
       */
      rejects(error: Error | string): StubTimes;

      /**
       * Return the given promise when the expectation is met.
       *
       * @param promise The promise to resolve to.
       */
      returns(promise: R): StubTimes;
    }
  : {
      /**
       * Return the given value when the expectation is met.
       *
       * @param returnValue
       */
      returns(returnValue: R): StubTimes;

      /**
       * Throw an error when the expectation is met.
       *
       * @param error Either an Error instance or an error message.
       */
      throws(error: Error | string): StubTimes;
    };

/**
 * Mock types and set expectations.
 *
 * Mocks are strict by default - an unexpected call will throw an error.
 */
export default class Mock<T> {
  private methodExpectations: Map<string, MethodExpectation[]> = new Map();

  private propertyExpectations: Map<string, PropertyExpectation[]> = new Map();

  private applyExpectations: MethodExpectation[] = [];

  when<R>(cb: (fake: T) => R): Stub<T, R> {
    let expectedArgs: any[] | undefined;
    let expectedProperty: string;

    const proxy = new Proxy(() => {}, {
      get: (target, property: string) => {
        expectedProperty = property;

        return (...args: any[]) => {
          expectedArgs = args;
        };
      },

      apply: (target: {}, thisArg: any, argArray?: any) => {
        expectedArgs = argArray;
      }
    });

    cb(proxy as T);

    // @ts-ignore because we can't do a typeof on the expectation to decide
    // if we should return the normal methods or the promise methods so we
    // return both and rely on the compiler to force the usage of one or the
    // other
    return {
      throws: (e: Error | string) =>
        this.returns(expectedArgs, expectedProperty, e, true),
      // TODO: support callbacks
      returns: (r: any) => this.returns(expectedArgs, expectedProperty, r),
      // TODO: support callbacks
      resolves: (r: any) =>
        this.returns(expectedArgs, expectedProperty, Promise.resolve(r)),
      rejects: (e: Error | string) =>
        this.returns(
          expectedArgs,
          expectedProperty,
          Promise.reject(typeof e === 'string' ? new Error(e) : e)
        )
    };
  }

  get stub(): T {
    return (new Proxy(() => {}, {
      get: (target, property: string) => {
        if (property === 'call') {
          // Transform from .call's ...args to .apply's [...args].
          return (thisArg: any, ...args: any[]) =>
            this.apply(target, thisArg, args);
        }

        if (property === 'apply') {
          return this.apply.bind(null, target);
        }

        return this.getPropertyOrMethod(property);
      },

      apply: this.apply
    }) as unknown) as T;
  }

  verifyAll() {
    this.propertyExpectations.forEach((expectations, p) => {
      expectations.forEach(expectation => {
        if (!expectation.met) {
          throw new UnmetPropertyExpectationError(p, expectation, expectations);
        }
      });
    });

    this.methodExpectations.forEach((expectations, p) => {
      expectations.forEach(expectation => {
        if (!expectation.met) {
          throw new UnmetMethodExpectationError(p, expectation, expectations);
        }
      });
    });

    this.applyExpectations.forEach(expectation => {
      if (!expectation.met) {
        throw new UnmetApplyExpectationError(
          expectation,
          this.applyExpectations
        );
      }
    });
  }

  reset() {
    this.propertyExpectations.clear();
    this.methodExpectations.clear();
    this.applyExpectations = [];
  }

  private returns(
    expectedArgs: any[] | undefined,
    expectedProperty: string,
    r: any,
    throws: boolean = false
  ): StubTimes {
    if (expectedArgs) {
      if (expectedProperty) {
        this.methodExpectations.set(expectedProperty, [
          ...(this.methodExpectations.get(expectedProperty) || []),
          new MethodExpectation(expectedArgs, r, throws)
        ]);
      } else {
        this.applyExpectations.push(
          new MethodExpectation(expectedArgs, r, throws)
        );
      }
    } else {
      this.propertyExpectations.set(expectedProperty, [
        ...(this.propertyExpectations.get(expectedProperty) || []),
        new PropertyExpectation(r, throws)
      ]);
    }

    return {
      anyTimes: () => {
        this.setInvocationCountExpectation(
          expectedArgs,
          expectedProperty,
          0,
          Infinity
        );
      },
      times: (exact: number) => {
        this.setInvocationCountExpectation(
          expectedArgs,
          expectedProperty,
          exact,
          exact
        );
      },
      between: (min: number, max: number) => {
        this.setInvocationCountExpectation(
          expectedArgs,
          expectedProperty,
          min,
          max
        );
      }
    };
  }

  private setInvocationCountExpectation(
    expectedArgs: undefined | any[],
    expectedProperty: string,
    min: number,
    max: number
  ) {
    if (expectedArgs) {
      if (expectedProperty) {
        this.methodExpectations.get(expectedProperty)!.slice(-1)[0].min = min;
        this.methodExpectations.get(expectedProperty)!.slice(-1)[0].max = max;
      } else {
        this.applyExpectations.slice(-1)[0].min = min;
        this.applyExpectations.slice(-1)[0].max = max;
      }
    } else {
      this.propertyExpectations.get(expectedProperty)!.slice(-1)[0].min = min;
      this.propertyExpectations.get(expectedProperty)!.slice(-1)[0].max = max;
    }
  }

  private getPropertyOrMethod = (property: string) => {
    const propertyExpectations = this.propertyExpectations.get(property);

    if (propertyExpectations) {
      const expectation = propertyExpectations.find(e => e.available);

      if (!expectation) {
        throw new UnexpectedAccessError(property);
      }

      return Mock.returnOrThrow(expectation);
    }

    const methodExpectations = this.methodExpectations.get(property);

    if (!methodExpectations) {
      // Since we don't have any property or method expectations we can't tell
      // if the requested property is a method or just a member, therefore we
      // throw a generic message.
      throw new UnexpectedAccessError(property);
    }

    return (...args: any[]) => {
      // Find the first available expectation.
      const expectation = methodExpectations.find(
        this.isAvailableExpectationWithMatchingArgs(args)
      );

      if (!expectation) {
        throw new WrongMethodArgsError(property, args, methodExpectations);
      }

      return Mock.returnOrThrow(expectation);
    };
  };

  private apply = (target: any, thisArg: any, actualArgs?: any) => {
    if (!this.applyExpectations.length) {
      throw new UnexpectedApplyError();
    }

    const expectation = this.applyExpectations.find(
      this.isAvailableExpectationWithMatchingArgs(actualArgs)
    );

    if (!expectation) {
      throw new WrongApplyArgsError(actualArgs, this.applyExpectations);
    }

    return Mock.returnOrThrow(expectation);
  };

  // eslint-disable-next-line class-methods-use-this
  private static returnOrThrow(
    expectation: PropertyExpectation | MethodExpectation
  ) {
    // eslint-disable-next-line no-param-reassign
    expectation.count++;

    if (expectation.throws) {
      if (typeof expectation.returnValue === 'string') {
        throw new Error(expectation.returnValue);
      } else {
        throw expectation.returnValue;
      }
    }

    return expectation.returnValue;
  }

  // eslint-disable-next-line class-methods-use-this
  private isAvailableExpectationWithMatchingArgs(actualArgs: any[]) {
    return (e: MethodExpectation) =>
      e.available && e.args.every(this.compareArgs(actualArgs));
  }

  // eslint-disable-next-line class-methods-use-this
  private compareArgs(actualArgs: any[]) {
    return (expected: any, i: number) => {
      const actual = actualArgs[i];

      if (expected && isMatcher(expected)) {
        return expected.matches(actual);
      }

      return isDeepStrictEqual(actual, expected);
    };
  }
}
