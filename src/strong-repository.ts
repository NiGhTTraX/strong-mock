import { BaseRepository, CountableExpectation } from './base-repository';
import { UnexpectedAccess, UnexpectedCall } from './errors';

/**
 * Throw if no expectation matches.
 */
export class StrongRepository extends BaseRepository {
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

  protected getValueForUnexpectedCall(property: PropertyKey, args: any[]) {
    throw new UnexpectedCall(property, args, this.getUnmet());
  }

  protected getValueForUnexpectedAccess(property: PropertyKey) {
    throw new UnexpectedAccess(property, this.getUnmet());
  }
}
