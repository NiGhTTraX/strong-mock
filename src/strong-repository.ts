import { BaseRepository, CountableExpectation } from './base-repository';
import { UnexpectedAccess, UnexpectedCall } from './errors';
import { Expectation } from './expectation';
import { ExpectationRepository, ReturnValue } from './expectation-repository';

const toStringKeys: PropertyKey[] = [
  'toString',
  Symbol.toStringTag,
  '@@toStringTag',
];

/**
 * - Expectations will be returned in the order they were added.
 * - If there are no matching expectations for 'toString' then a default will be returned.
 * - If there are no matching expectations `undefined` will be returned.
 */
export class StrongRepository implements ExpectationRepository {
  private expectations: Expectation[] = [];

  add(expectation: Expectation) {
    this.expectations.push(expectation);
  }

  /**
   * @returns If nothing matches will return `undefined`.
   */
  get(property: PropertyKey, args: any[] | undefined): ReturnValue | undefined {
    const expectation = this.expectations.find((e) =>
      e.matches(property, args)
    );

    if (expectation) {
      return { returnValue: expectation.returnValue };
    }

    // TODO: move the return values to `toStringKeys`
    switch (property) {
      case 'toString':
        return { returnValue: () => 'mock' };
      case Symbol.toStringTag:
      case '@@toStringTag':
        return { returnValue: 'mock' };
      default:
        return undefined;
    }
  }

  hasKey(property: PropertyKey) {
    return (
      !!this.expectations.find((e) => e.property === property) ||
      toStringKeys.includes(property)
    );
  }

  getUnmet() {
    return this.expectations.filter((e) => e.isUnmet());
  }

  clear(): void {
    this.expectations = [];
  }
}

export class StrongRepository2 extends BaseRepository {
  protected consumeExpectation(expectation: CountableExpectation): void {
    const { property, max } = expectation.expectation;

    const expectations = this.expectations.get(property)!;

    if (expectation.matchCount === max) {
      this.expectations.set(
        property,
        expectations.filter((e) => e !== expectation)
      );
    }
  }

  private static readonly TO_STRING_VALUE = 'strong-mock';

  protected getValueForUnexpectedCall(property: PropertyKey, args: any[]) {
    throw new UnexpectedCall(property, args, this.getUnmet());
  }

  protected getValueForUnexpectedAccess(property: PropertyKey) {
    switch (property) {
      case 'toString':
        return () => StrongRepository2.TO_STRING_VALUE;
      case '@@toStringTag':
      case Symbol.toStringTag:
        return StrongRepository2.TO_STRING_VALUE;
      default:
        throw new UnexpectedAccess(property, this.getUnmet());
    }
  }
}
