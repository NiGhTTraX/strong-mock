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

export type Stub<T, R> = {
  returns(r: R): void;
}

/**
 * Mock interfaces and set method and property expectations.
 *
 * Mocks are strict by default - an unexpected call will throw an error
 * and so will a call with more params than expected.
 */
export default class Mock<T> {
  private methodExpectations: Map<string, MethodExpectation[]> = new Map();

  private propertyExpectations: Map<string, PropertyExpectation> = new Map();

  private applyExpectations: MethodExpectation[] = [];

  // TODO: implement It.isAny
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

    cb(proxy as unknown as T);

    return {
      returns: (r: R) => {
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
          // TODO: support multiple expectations
          this.propertyExpectations.set(
            expectedProperty,
            new PropertyExpectation(r)
          );
        }
      }
    };
  }

  get stub(): T {
    return new Proxy(() => {}, {
      get: (target, property: string) => {
        const propertyExpectation = this.propertyExpectations.get(property);

        if (propertyExpectation) {
          propertyExpectation.met = true;

          return propertyExpectation.r;
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

          expectation.met = true;

          return expectation.r;
        };
      },

      apply: (target: () => void, thisArg: any, argArray?: any) => {
        if (!this.applyExpectations.length) {
          throw new UnexpectedApplyError();
        }

        const expectation = this.applyExpectations.find(
          this.isUnmetExpectationWithMatchingArgs(argArray)
        );

        if (!expectation) {
          throw new WrongApplyArgsError(argArray, this.applyExpectations);
        }

        expectation.met = true;

        return expectation.r;
      }
    }) as unknown as T;
  }

  verifyAll() {
    this.propertyExpectations.forEach((expectation, p) => {
      if (!expectation.met) {
        throw new UnmetPropertyExpectationError(p, expectation);
      }
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

  // eslint-disable-next-line class-methods-use-this
  private isUnmetExpectationWithMatchingArgs(args: any[]) {
    // We check in both directions to
    // 1) catch extra args that were not expected and
    // 2) treat `undefined` and missing optional args as equal.
    return (e: MethodExpectation) => !e.met
      && e.args.every(this.compareArgs(args))
      && args.every(this.compareArgs(e.args));
  }

  // eslint-disable-next-line class-methods-use-this
  private compareArgs(args: any[]) {
    return (arg: any, i: number) => isDeepStrictEqual(args[i], arg);
  }
}
