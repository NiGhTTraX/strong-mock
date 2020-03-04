import { MissingWhen, UnfinishedExpectation } from './errors';
import { Expectation } from './expectation';
import { ExpectationRepository } from './expectation-repository';
import { printWhen } from './print';

export type ExpectationFactory = (
  property: PropertyKey,
  args: any[] | undefined,
  returnValue: any
) => Expectation;

export interface PendingExpectation {
  // TODO: get rid of repo
  start(repo: ExpectationRepository): void;

  finish(returnValue: any): Expectation;

  clear(): void;

  property: PropertyKey;

  args: any[] | undefined;

  /**
   * Used by `pretty-format`.
   */
  toJSON(): string;
}

export class RepoSideEffectPendingExpectation implements PendingExpectation {
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

  toJSON() {
    return printWhen(this._property, this._args);
  }
}
