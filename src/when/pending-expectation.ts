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

/**
 * An expectation has to be built incrementally, starting first with the property
 * being accessed inside {@link createStub}, then any arguments passed to it, and ending
 * it with the returned value from {@link createReturns}.
 */
export interface PendingExpectation {
  start(): void;

  finish(returnValue: ReturnValue): Expectation;

  clear(): void;

  property: Property;

  args: any[] | undefined;

  /**
   * Used by `pretty-format`.
   */
  toJSON(): string;
}

// TODO: remove side effect
export class RepoSideEffectPendingExpectation implements PendingExpectation {
  private _args: any[] | undefined;

  private started: boolean = false;

  private _property: Property = '';

  constructor(
    private createExpectation: ExpectationFactory,
    private repo: ExpectationRepository,
    private concreteMatcher: ConcreteMatcher,
    private exactParams: boolean
  ) {}

  start() {
    if (this.started) {
      throw new UnfinishedExpectation(this);
    }

    this.started = true;
  }

  set property(value: Property) {
    this._property = value;
  }

  set args(value: any[] | undefined) {
    this._args = value;
  }

  finish(returnValue: ReturnValue): Expectation {
    if (!this.started) {
      throw new MissingWhen();
    }

    const expectation = this.createExpectation(
      this._property,
      this._args,
      returnValue,
      this.concreteMatcher,
      this.exactParams
    );
    this.repo.add(expectation);

    this.clear();

    return expectation;
  }

  clear() {
    this.started = false;
  }

  toJSON() {
    return printWhen(this._property, this._args);
  }
}
