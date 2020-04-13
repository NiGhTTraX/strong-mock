import { Expectation2 } from './expectation';
import { CallMap, ExpectationRepository2 } from './expectation-repository';

export type CountableExpectation = {
  expectation: Expectation2;
  matchCount: number;
};

export abstract class BaseRepository implements ExpectationRepository2 {
  protected readonly expectations = new Map<
    PropertyKey,
    CountableExpectation[]
  >();

  private readonly callStats: CallMap = new Map();

  add(expectation: Expectation2): void {
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
    this.callStats.clear();
  }

  get(property: PropertyKey): any {
    this.record(property, undefined);

    const expectations = this.expectations.get(property);

    if (expectations && expectations.length) {
      const propertyExpectation = expectations.find((e) =>
        e.expectation.matches(undefined)
      );

      if (propertyExpectation) {
        this.countAndConsume(propertyExpectation);

        return propertyExpectation.expectation.returnValue;
      }

      return (...args: any[]) => {
        this.record(property, args);

        const callExpectation = expectations.find((e) =>
          e.expectation.matches(args)
        );

        if (callExpectation) {
          this.countAndConsume(callExpectation);

          return callExpectation.expectation.returnValue;
        }

        return this.getValueForUnexpectedCall(property, args);
      };
    }

    return this.getValueForUnexpectedAccess(property);
  }

  getCallStats() {
    return { expected: this.callStats, unexpected: new Map() };
  }

  getUnmet(): Expectation2[] {
    return ([] as Expectation2[]).concat(
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
    property: PropertyKey,
    args: any[]
  ): any;

  /**
   * We got a property access that doesn't match any expectation,
   * what should we return?
   */
  protected abstract getValueForUnexpectedAccess(property: PropertyKey): any;

  protected abstract consumeExpectation(
    expectation: CountableExpectation
  ): void;

  /**
   * Record the property access/method call.
   */
  protected record(property: PropertyKey, args: any[] | undefined) {
    const calls = this.callStats.get(property) || [];

    this.callStats.set(property, [...calls, { arguments: args }]);
  }

  private countAndConsume(expectation: CountableExpectation) {
    // eslint-disable-next-line no-param-reassign
    expectation.matchCount++;

    this.consumeExpectation(expectation);
  }
}
