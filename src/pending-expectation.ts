import { MissingWhen, UnfinishedExpectation } from './errors';
import { DeepComparisonExpectation, Expectation } from './expectation';
import { ExpectationRepository } from './expectation-repository';
import { printWhen } from './print';

export type ExpectationFactory = (
  property: PropertyKey,
  args: any[] | undefined,
  returnValue: any
) => Expectation;

export interface PendingExpectation {
  start(repo: ExpectationRepository): void;

  finish(returnValue: any): Expectation;

  clear(): void;

  property: PropertyKey;

  args: any[] | undefined;
}

export class SingletonPendingExpectation implements PendingExpectation {
  private _repo: ExpectationRepository | undefined;

  private _args: any[] | undefined;

  private _property: PropertyKey = '';

  constructor(private createExpectation: ExpectationFactory) {}

  start(repo: ExpectationRepository) {
    if (this._repo) {
      throw new UnfinishedExpectation(this);
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

    const expectation = this.createExpectation(
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

  toString() {
    return printWhen(this._property, this._args);
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
export const SINGLETON_PENDING_EXPECTATION = new SingletonPendingExpectation(
  (property, args, returnValue) =>
    new DeepComparisonExpectation(property, args, returnValue)
);
