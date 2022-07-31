import { UnexpectedAccess, UnexpectedCall } from '../../errors';
import { returnOrThrow } from '../../mock/stub';
import { Property } from '../../proxy';
import { ApplyProp, Expectation, ReturnValue } from '../expectation';
import { MATCHER_SYMBOL } from '../matcher';
import { CallMap, ExpectationRepository } from './expectation-repository';

/**
 * Controls what happens when a property is accessed, or a call is made,
 * and there are no expectations set for it.
 */
export enum Strictness {
  /**
   * Any property that's accessed, or any call that's made, without a matching
   * expectation, will throw immediately.
   *
   * @example
   * type Service = { foo: (x: number) => number };
   * const service = mock<Service>();
   *
   * // This will throw.
   * const { foo } = service;
   *
   * // Will throw "Didn't expect foo to be accessed",
   * // without printing the arguments.
   * foo(42);
   */
  SUPER_STRICT,
  /**
   * Properties with unmatched expectations will return functions that will
   * throw if called. This can be useful if your code destructures a function
   * but never calls it.
   *
   * It will also improve error messages for unexpected calls because arguments
   * will be captured instead of throwing immediately on the property access.
   *
   * @example
   * type Service = { foo: (x: number) => number };
   * const service = mock<Service>();
   *
   * // This will not throw.
   * const { foo } = service;
   *
   * // Will throw "Didn't expect foo(42) to be called".
   * foo(42);
   */
  STRICT,
}

type CountableExpectation = {
  expectation: Expectation;
  matchCount: number;
};

/**
 * An expectation repository for configurable levels of strictness.
 */
export class FlexibleRepository implements ExpectationRepository {
  constructor(private strictness: Strictness = Strictness.SUPER_STRICT) {}

  protected readonly expectations = new Map<Property, CountableExpectation[]>();

  private readonly expectedCallStats: CallMap = new Map();

  private readonly unexpectedCallStats: CallMap = new Map();

  add(expectation: Expectation): void {
    const { property } = expectation;

    const expectations = this.expectations.get(property) || [];

    this.expectations.set(property, [
      ...expectations,
      {
        expectation,
        matchCount: 0,
      },
    ]);
  }

  clear(): void {
    this.expectations.clear();
    this.expectedCallStats.clear();
    this.unexpectedCallStats.clear();
  }

  get(property: Property): ReturnValue {
    const expectations = this.expectations.get(property);

    if (expectations && expectations.length) {
      // We record that an expected property access has happened, but an
      // unexpected call could still happen later.
      this.recordExpected(property, undefined);

      const propertyExpectation = expectations.find((e) =>
        e.expectation.matches(undefined)
      );

      if (propertyExpectation) {
        this.countAndConsume(propertyExpectation);

        return propertyExpectation.expectation.returnValue;
      }

      return {
        value: (...args: any[]) => {
          const callExpectation = expectations.find((e) =>
            e.expectation.matches(args)
          );

          if (callExpectation) {
            this.recordExpected(property, args);
            this.countAndConsume(callExpectation);

            // TODO: this is duplicated in stub
            return returnOrThrow(callExpectation.expectation.returnValue);
          }

          return this.getValueForUnexpectedCall(property, args);
        },
      };
    }

    switch (property) {
      case 'toString':
        return { value: () => 'mock' };
      case '@@toStringTag':
      case Symbol.toStringTag:
      case 'name':
        return { value: 'mock' };

      // pretty-format
      case '$$typeof':
      case 'constructor':
      case '@@__IMMUTABLE_ITERABLE__@@':
      case '@@__IMMUTABLE_RECORD__@@':
        return { value: null };

      case MATCHER_SYMBOL:
        return { value: false };

      case ApplyProp:
        return {
          value: (...args: any[]) =>
            this.getValueForUnexpectedCall(property, args),
        };
      default:
        return this.getValueForUnexpectedAccess(property);
    }
  }

  getAllProperties(): Property[] {
    return Array.from(this.expectations.keys());
  }

  getCallStats() {
    return {
      expected: this.expectedCallStats,
      unexpected: this.unexpectedCallStats,
    };
  }

  getUnmet(): Expectation[] {
    return ([] as Expectation[]).concat(
      ...Array.from(this.expectations.values()).map((expectations) =>
        expectations
          .filter((e) => e.expectation.min > e.matchCount)
          .map((e) => e.expectation)
      )
    );
  }

  private recordExpected(property: Property, args: any[] | undefined) {
    const calls = this.expectedCallStats.get(property) || [];

    this.expectedCallStats.set(property, [...calls, { arguments: args }]);
  }

  private recordUnexpected(property: Property, args: any[] | undefined) {
    const calls = this.unexpectedCallStats.get(property) || [];

    this.unexpectedCallStats.set(property, [...calls, { arguments: args }]);
  }

  private countAndConsume(expectation: CountableExpectation) {
    // eslint-disable-next-line no-param-reassign
    expectation.matchCount++;

    this.consumeExpectation(expectation);
  }

  private consumeExpectation(expectation: CountableExpectation): void {
    const { property, max } = expectation.expectation;

    const expectations = this.expectations.get(property)!;

    if (expectation.matchCount === max) {
      this.expectations.set(
        property,
        expectations.filter((e) => e !== expectation)
      );
    }
  }

  private getValueForUnexpectedCall(property: Property, args: any[]): never {
    this.recordUnexpected(property, args);

    throw new UnexpectedCall(property, args, this.getUnmet());
  }

  private getValueForUnexpectedAccess(property: Property): ReturnValue {
    if (this.strictness === Strictness.SUPER_STRICT) {
      this.recordUnexpected(property, undefined);

      throw new UnexpectedAccess(property, this.getUnmet());
    }

    return {
      value: (...args: unknown[]) => {
        this.recordUnexpected(property, args);

        throw new UnexpectedCall(property, args, this.getUnmet());
      },
    };
  }
}
