import { UnexpectedAccess, UnexpectedCall } from '../../errors';
import { Property } from '../../proxy';
import { ReturnValue } from '../expectation';
import { BaseRepository, CountableExpectation } from './base-repository';

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
/**
 * Throw if no expectation matches.
 */
export class StrongRepository extends BaseRepository {
  constructor(private strictness: Strictness = Strictness.SUPER_STRICT) {
    super();
  }

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

  protected getValueForUnexpectedCall(property: Property, args: any[]): never {
    throw new UnexpectedCall(property, args, this.getUnmet());
  }

  protected getValueForUnexpectedAccess(property: Property): ReturnValue {
    if (this.strictness === Strictness.SUPER_STRICT) {
      throw new UnexpectedAccess(property, this.getUnmet());
    }

    return {
      value: (...args: unknown[]) => {
        throw new UnexpectedCall(property, args, this.getUnmet());
      },
    };
  }
}
