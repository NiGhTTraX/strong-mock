import { UnexpectedAccess, UnexpectedCall } from '../../errors';
import { Strictness } from '../../mock/options';
import { Property } from '../../proxy';
import { ApplyProp, Expectation } from '../expectation';
import { MATCHER_SYMBOL } from '../matcher';
import { CallMap, ExpectationRepository } from './expectation-repository';
import { unboxReturnValue } from './return-value';

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

  apply = (args: unknown[]): unknown => this.get(ApplyProp)(...args);

  // TODO: this returns any, but the interface returns unknown
  //   unknown causes errors in apply tests, and any causes bugs in bootstrapped SM
  get(property: Property): any {
    const expectations = this.expectations.get(property);

    if (expectations && expectations.length) {
      return this.handlePropertyWithMatchingExpectations(
        property,
        expectations
      );
    }

    return this.handlePropertyWithNoExpectations(property);
  }

  private handlePropertyWithMatchingExpectations = (
    property: Property,
    expectations: CountableExpectation[]
  ) => {
    // Avoid recording call stats for function calls, since the property is an
    // internal detail.
    if (property !== ApplyProp) {
      // An unexpected call could still happen later, if the property returns a
      // function that will not match the given args.
      this.recordExpected(property, undefined);
    }

    const propertyExpectation = expectations.find((e) =>
      e.expectation.matches(undefined)
    );

    if (propertyExpectation) {
      this.countAndConsume(propertyExpectation);

      return unboxReturnValue(propertyExpectation.expectation.returnValue);
    }

    return (...args: any[]) => {
      const callExpectation = expectations.find((e) =>
        e.expectation.matches(args)
      );

      if (callExpectation) {
        this.recordExpected(property, args);
        this.countAndConsume(callExpectation);

        return unboxReturnValue(callExpectation.expectation.returnValue);
      }

      return this.getValueForUnexpectedCall(property, args);
    };
  };

  private handlePropertyWithNoExpectations = (property: Property) => {
    switch (property) {
      case 'toString':
        return () => 'mock';
      case '@@toStringTag':
      case Symbol.toStringTag:
      case 'name':
        return 'mock';

      // pretty-format
      case '$$typeof':
      case 'constructor':
      case '@@__IMMUTABLE_ITERABLE__@@':
      case '@@__IMMUTABLE_RECORD__@@':
        return null;

      case MATCHER_SYMBOL:
        return false;

      case ApplyProp:
        return (...args: any[]) =>
          this.getValueForUnexpectedCall(property, args);
      default:
        return this.getValueForUnexpectedAccess(property);
    }
  };

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

  private getValueForUnexpectedAccess(property: Property): unknown {
    if (this.strictness === Strictness.SUPER_STRICT) {
      this.recordUnexpected(property, undefined);

      throw new UnexpectedAccess(property, this.getUnmet());
    }

    return (...args: unknown[]) => {
      this.recordUnexpected(property, args);

      throw new UnexpectedCall(property, args, this.getUnmet());
    };
  }
}
