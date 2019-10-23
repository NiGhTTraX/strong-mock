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
import { MethodExpectation, PropertyExpectation } from './expectations';
import { isMatcher } from './matcher';

interface StubTimes {
  /**
   * This expectation will never be consumed, unless the mock is reset.
   */
  always(): void;

  /**
   * This expectation will be consumed after `x` invocations.
   * @param x
   */
  times(x: number): void;
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
}

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
      returns: (r: any) => this.returns(expectedArgs, expectedProperty, r),
      resolves: (r: any) => this.returns(expectedArgs, expectedProperty, Promise.resolve(r))
    };
  }

  private returns(expectedArgs: any[] | undefined, expectedProperty: string, r: any) {
    if (expectedArgs) {
      if (expectedProperty) {
        this.methodExpectations.set(
          expectedProperty,
          [
            ...(this.methodExpectations.get(expectedProperty) || []),
            new MethodExpectation(expectedArgs, r)
          ]
        );
      } else {
        this.applyExpectations.push(new MethodExpectation(expectedArgs, r));
      }
    } else {
      this.propertyExpectations.set(
        expectedProperty,
        [
          ...(this.propertyExpectations.get(expectedProperty) || []),
          new PropertyExpectation(r)
        ]
      );
    }

    return {
      always: () => {
        if (expectedArgs) {
          if (expectedProperty) {
            this.methodExpectations.get(expectedProperty)!.slice(-1)[0].times = -1;
          } else {
            this.applyExpectations.slice(-1)[0].times = -1;
          }
        } else {
          this.propertyExpectations.get(expectedProperty)!.slice(-1)[0].times = -1;
        }
      },
      times: (x: number) => {
        if (expectedArgs) {
          if (expectedProperty) {
            this.methodExpectations.get(expectedProperty)!.slice(-1)[0].times = x;
          } else {
            this.applyExpectations.slice(-1)[0].times = x;
          }
        } else {
          this.propertyExpectations.get(expectedProperty)!.slice(-1)[0].times = x;
        }
      }
    };
  }

  get stub(): T {
    return new Proxy(() => {}, {
      get: (target, property: string) => {
        if (property === 'call') {
          // Transform from .call's ...args to .apply's [...args].
          return (thisArg: any, ...args: any[]) => this.apply(target, thisArg, args);
        }

        if (property === 'apply') {
          return this.apply.bind(null, target);
        }

        return this.get(property);
      },

      apply: this.apply
    }) as unknown as T;
  }

  verifyAll() {
    this.propertyExpectations.forEach((expectations, p) => {
      expectations.forEach(expectation => {
        if (!expectation.met) {
          throw new UnmetPropertyExpectationError(p, expectation);
        }
      });
    });

    this.methodExpectations.forEach((expectations, p) => {
      expectations.forEach(expectation => {
        if (!expectation.met) {
          throw new UnmetMethodExpectationError(p, expectation);
        }
      });
    });

    this.applyExpectations.forEach(expectation => {
      if (!expectation.met) {
        throw new UnmetApplyExpectationError(expectation);
      }
    });
  }

  reset() {
    this.propertyExpectations.clear();
    this.methodExpectations.clear();
    this.applyExpectations = [];
  }

  private get = (property: string) => {
    const propertyExpectations = this.propertyExpectations.get(property);

    if (propertyExpectations) {
      const expectation = propertyExpectations.find(e => !e.met);

      if (!expectation) {
        throw new UnexpectedAccessError(property);
      }

      if (expectation.times !== -1) {
        expectation.times--;

        if (expectation.times === 0) {
          expectation.met = true;
        }
      }

      return expectation.r;
    }

    const methodExpectations = this.methodExpectations.get(property);

    if (!methodExpectations) {
      // Since we don't have any property or method expectations we can't tell
      // if the requested property is a method or just a getter, therefore we
      // throw a generic message.
      throw new UnexpectedAccessError(property);
    }

    return (...args: any[]) => {
      // Find the first unmet expectation.
      const expectation = methodExpectations.find(
        this.isUnmetExpectationWithMatchingArgs(args)
      );

      if (!expectation) {
        throw new WrongMethodArgsError(property, args, methodExpectations);
      }

      if (expectation.times !== -1) {
        expectation.times--;

        if (expectation.times === 0) {
          expectation.met = true;
        }
      }

      return expectation.r;
    };
  };

  private apply = (target: any, thisArg: any, actualArgs?: any) => {
    if (!this.applyExpectations.length) {
      throw new UnexpectedApplyError();
    }

    const expectation = this.applyExpectations.find(
      this.isUnmetExpectationWithMatchingArgs(actualArgs)
    );

    if (!expectation) {
      throw new WrongApplyArgsError(actualArgs, this.applyExpectations);
    }

    if (expectation.times !== -1) {
      expectation.times--;

      if (expectation.times === 0) {
        expectation.met = true;
      }
    }

    return expectation.r;
  };

  // eslint-disable-next-line class-methods-use-this
  private isUnmetExpectationWithMatchingArgs(actualArgs: any[]) {
    return (e: MethodExpectation) => !e.met
      && e.args.every(this.compareArgs(actualArgs));
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
