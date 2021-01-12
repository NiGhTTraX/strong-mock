import { BaseRepository, CountableExpectation } from './base-repository';
import { Expectation } from './expectation';
import { ExpectationRepository } from './expectation-repository';

/**
 * Always return something, even if no expectations match.
 *
 * WARNING: this is in development, do not use
 */
export class WeakRepository
  extends BaseRepository
  implements ExpectationRepository {
  private repeating = new Map<PropertyKey, boolean>();

  protected getValueForUnexpectedCall = () => null;

  protected getValueForUnexpectedAccess = () => () => null;

  protected consumeExpectation(expectation: CountableExpectation): void {
    const { property, max } = expectation.expectation;

    const expectations = this.expectations.get(property)!;

    if (expectation.matchCount === max) {
      if (expectations.length === 1) {
        // Leave the expectation there and mark it as repeating so we can
        // remove it the next time we add a different expectation.
        this.repeating.set(property, true);
      } else {
        this.expectations.set(
          property,
          expectations.filter((e) => e !== expectation)
        );
      }
    }
  }

  add(expectation: Expectation): void {
    const { property } = expectation;

    const expectations = this.expectations.get(property);

    if (expectations) {
      if (expectations.length === 1 && this.repeating.get(property)) {
        // Remove the repeating expectation and continue to add the new one.
        this.repeating.set(property, false);
        this.expectations.set(property, []);
      }
    }

    super.add(expectation);
  }
}
