import { BaseRepository, CountableExpectation } from './base-repository';
import { UnexpectedAccess, UnexpectedCall } from './errors';
import { ApplyProp } from './expectation';

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

  private static readonly TO_STRING_VALUE = 'strong-mock';

  protected getValueForUnexpectedCall(property: PropertyKey, args: any[]) {
    throw new UnexpectedCall(property, args, this.getUnmet());
  }

  protected getValueForUnexpectedAccess(property: PropertyKey) {
    // TODO: abstract the toString logic away (maybe move it to the base repo)
    switch (property) {
      case 'toString':
        return () => StrongRepository.TO_STRING_VALUE;
      case '@@toStringTag':
      case Symbol.toStringTag:
        return StrongRepository.TO_STRING_VALUE;
      case ApplyProp:
        return (...args: any[]) => {
          throw new UnexpectedCall(ApplyProp, args, this.getUnmet());
        };
      default:
        throw new UnexpectedAccess(property, this.getUnmet());
    }
  }
}
