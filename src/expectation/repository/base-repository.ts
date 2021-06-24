import { returnOrThrow } from '../../instance/instance';
import { ApplyProp, Expectation } from '../expectation';
import { CallMap, ExpectationRepository } from './expectation-repository';
import { Property } from '../../proxy';

export type CountableExpectation = {
  expectation: Expectation;
  matchCount: number;
};

export abstract class BaseRepository implements ExpectationRepository {
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

  get(property: Property): any {
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

        return propertyExpectation.expectation.returnValue.value;
      }

      return (...args: any[]) => {
        const callExpectation = expectations.find((e) =>
          e.expectation.matches(args)
        );

        if (callExpectation) {
          this.recordExpected(property, args);
          this.countAndConsume(callExpectation);

          return returnOrThrow(callExpectation.expectation.returnValue.value);
        }

        this.recordUnexpected(property, args);
        return this.getValueForUnexpectedCall(property, args);
      };
    }

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

      case ApplyProp:
        return (...args: any[]) => {
          this.recordUnexpected(property, args);
          return this.getValueForUnexpectedCall(property, args);
        };
      default:
        this.recordUnexpected(property, undefined);
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

  /**
   * We got a method call that doesn't match any expectation,
   * what should we return?
   */
  protected abstract getValueForUnexpectedCall(
    property: Property,
    args: any[]
  ): any;

  /**
   * We got a property access that doesn't match any expectation,
   * what should we return?
   */
  protected abstract getValueForUnexpectedAccess(property: Property): any;

  protected abstract consumeExpectation(
    expectation: CountableExpectation
  ): void;

  /**
   * Record an expected property access/method call.
   */
  private recordExpected(property: Property, args: any[] | undefined) {
    const calls = this.expectedCallStats.get(property) || [];

    this.expectedCallStats.set(property, [...calls, { arguments: args }]);
  }

  /**
   * Record an unexpected property access/method call.
   */
  private recordUnexpected(property: Property, args: any[] | undefined) {
    const calls = this.unexpectedCallStats.get(property) || [];

    this.unexpectedCallStats.set(property, [...calls, { arguments: args }]);
  }

  private countAndConsume(expectation: CountableExpectation) {
    // eslint-disable-next-line no-param-reassign
    expectation.matchCount++;

    this.consumeExpectation(expectation);
  }
}
