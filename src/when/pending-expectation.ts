import { MissingWhen, UnfinishedExpectation } from '../errors';
import { Expectation, ReturnValue } from '../expectation/expectation';
import { ExpectationRepository } from '../expectation/repository/expectation-repository';
import { ConcreteMatcher } from '../mock/options';
import { printWhen } from '../print';
import { Property } from '../proxy';

export type ExpectationFactory = (
  property: Property,
  args: any[] | undefined,
  returnValue: ReturnValue,
  concreteMatcher: ConcreteMatcher,
  exactParams: boolean
) => Expectation;

export interface PendingExpectation {
  // TODO: get rid of repo
  start(
    repo: ExpectationRepository,
    concreteMatcher: ConcreteMatcher,
    exactParams: boolean
  ): void;

  finish(returnValue: ReturnValue): Expectation;

  clear(): void;

  property: Property;

  args: any[] | undefined;

  /**
   * Used by `pretty-format`.
   */
  toJSON(): string;
}

export class RepoSideEffectPendingExpectation implements PendingExpectation {
  private _repo: ExpectationRepository | undefined;

  private _concreteMatcher: ConcreteMatcher | undefined;

  private _args: any[] | undefined;

  private _property: Property = '';

  private _exactParams: boolean | undefined;

  constructor(private createExpectation: ExpectationFactory) {}

  start(
    repo: ExpectationRepository,
    concreteMatcher: ConcreteMatcher,
    exactParams: boolean
  ) {
    if (this._repo) {
      throw new UnfinishedExpectation(this);
    }

    this.clear();

    this._repo = repo;
    this._concreteMatcher = concreteMatcher;
    this._exactParams = exactParams;
  }

  set property(value: Property) {
    this._property = value;
  }

  set args(value: any[] | undefined) {
    this._args = value;
  }

  finish(returnValue: ReturnValue): Expectation {
    if (
      !this._repo ||
      !this._concreteMatcher ||
      this._exactParams === undefined
    ) {
      throw new MissingWhen();
    }

    const expectation = this.createExpectation(
      this._property,
      this._args,
      returnValue,
      this._concreteMatcher,
      this._exactParams
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
