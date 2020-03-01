import { MissingReturnValue, MissingWhen } from './errors';
import { Expectation, DeepComparisonExpectation } from './expectation';
import { ExpectationRepository } from './expectation-repository';

export class PendingExpectation {
  private _repo: ExpectationRepository | undefined;

  private _args: any[] | undefined;

  private _property: PropertyKey = '';

  start(repo: ExpectationRepository) {
    if (this._repo) {
      throw new MissingReturnValue();
    }

    this.clear();

    this._repo = repo;
  }

  set property(value: PropertyKey) {
    this._property = value;
  }

  set args(value: any[] | undefined) {
    this._args = value;
  }

  finish(returnValue: any): Expectation {
    if (!this._repo) {
      throw new MissingWhen();
    }

    // TODO: inject factory?
    const expectation = new DeepComparisonExpectation(
      this._property,
      this._args,
      returnValue
    );
    this._repo.add(expectation);

    this.clear();

    return expectation;
  }

  clear() {
    this._repo = undefined;
    this._args = undefined;
    this._property = '';
  }
}

/**
 * Since `when()` doesn't receive the mock subject (because we can't make it
 * consistently return it from `mock()`, `mock.bar` and `mock.ba()`) we need
 * to store a global state for the currently active mock.
 *
 * We also want to throw in the following case:
 *
 * ```
 * when(mock()) // forgot returns here
 * when(mock()) // should throw
 * ```
 *
 * For that reason we can't just store the currently active mock, but also
 * whether we finished the expectation or not. We encode those 2 pieces of info
 * in one variable - "pending expectation".
 */
export const SINGLETON_PENDING_EXPECTATION = new PendingExpectation();
