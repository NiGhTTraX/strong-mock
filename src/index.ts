import { inspect, isDeepStrictEqual } from 'util';

export type Stub<T, R> = {
  returns(r: R): void;
}

class MethodExpectation {
  public args: any[];

  public r: any;

  public met: boolean;

  constructor(args: any[], r: any) {
    this.args = args;
    this.met = false;
    this.r = r;
  }

  toString() {
    return `${inspect(this.args)} => ${inspect(this.r)}`;
  }
}

class PropertyExpectation {
  public r: any;

  public met: boolean;

  constructor(r: any) {
    this.met = false;
    this.r = r;
  }

  toString() {
    return `=> ${inspect(this.r)}`;
  }
}

export class UnmetMethodExpectationError extends Error {
  constructor(property: string, expectation: MethodExpectation) {
    super(`Expected ${property} to be called with ${expectation}`);

    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, UnmetMethodExpectationError.prototype);
  }
}

export class UnmetPropertyExpectationError extends Error {
  constructor(property: string, expectation: PropertyExpectation) {
    super(`Expected ${property} to be called with ${expectation}`);

    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, UnmetPropertyExpectationError.prototype);
  }
}

export class UnexpectedMethodCallError extends Error {
  constructor(property: string, args: any[], expectations: MethodExpectation[]) {
    super(`${property} not expected to be called with ${inspect(args)}!

Existing expectations:
${expectations.join(' or ')}`);

    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, UnexpectedMethodCallError.prototype);
  }
}

export class UnexpectedAccessError extends Error {
  constructor(property: string) {
    super(`${property} not expected to be accessed`);

    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, UnexpectedAccessError.prototype);
  }
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

  // TODO: implement It.isAny
  when<R>(cb: (fake: T) => R): Stub<T, R> {
    let expectedArgs: any[] | undefined;
    let expectedProperty: string;

    const proxy = new Proxy({}, {
      get: (target, property: string) => {
        expectedProperty = property;

        return (...args: any[]) => {
          expectedArgs = args;
        };
      }
    });

    cb(proxy as T);

    return {
      returns: (r: R) => {
        if (expectedArgs) {
          this.methodExpectations.set(
            expectedProperty,
            [
              ...(this.methodExpectations.get(expectedProperty) || []),
              new MethodExpectation(expectedArgs, r)
            ]
          );
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
    return new Proxy({}, {
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
          const expectation = methodExpectations.find(this.checkExpectedArgs(args));

          if (expectation) {
            expectation.met = true;

            return expectation.r;
          }

          throw new UnexpectedMethodCallError(property, args, methodExpectations);
        };
      }
    }) as T;
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
  }

  reset() {
    this.propertyExpectations.clear();
    this.methodExpectations.clear();
  }

  // eslint-disable-next-line class-methods-use-this
  private checkExpectedArgs(args: any[]) {
    // We check in both directions to
    // 1) catch extra args that were not expected and
    // 2) treat `undefined` and missing optional args as equal.
    return (e: MethodExpectation) => e.args.every(this.compareArgs(args))
      && args.every(this.compareArgs(e.args));
  }

  // eslint-disable-next-line class-methods-use-this
  private compareArgs(args: any[]) {
    return (arg: any, i: number) => isDeepStrictEqual(args[i], arg);
  }
}
