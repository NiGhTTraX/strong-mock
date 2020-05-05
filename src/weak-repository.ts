import { BaseRepository, CountableExpectation } from './base-repository';
import { Expectation2 } from './expectation';
import { ExpectationRepository2 } from './expectation-repository';

/**
 * WARNING: this is in development, do not use
 */
export class WeakRepository extends BaseRepository
  implements ExpectationRepository2 {
  private static TO_STRING_VALUE = 'weak-mock';

  private repeating = new Map<PropertyKey, boolean>();

  protected getValueForUnexpectedCall = (): any => null;

  protected getValueForUnexpectedAccess(property: PropertyKey): any {
    switch (property) {
      case 'toString':
        return () => WeakRepository.TO_STRING_VALUE;
      case '@@toStringTag':
      case Symbol.toStringTag:
        return WeakRepository.TO_STRING_VALUE;
      default:
        return (...args: any[]) => {
          this.recordExpected(property, args);

          return null;
        };
    }
  }

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

  add(expectation: Expectation2): void {
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
