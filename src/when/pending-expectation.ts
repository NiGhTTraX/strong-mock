import { MissingWhen, UnfinishedExpectation } from '../errors/api';
import type { Expectation } from '../expectation/expectation';
import type { ReturnValue } from '../expectation/repository/return-value';
import type { ConcreteMatcher } from '../mock/options';
import { printWhen } from '../print';
import type { Property } from '../proxy';

/**
 * An expectation has to be built incrementally, starting first with the property
 * being accessed inside {@link createStub}, then any arguments passed to it, and ending
 * it with the returned value from {@link createReturns}.
 */
export interface PendingExpectation {
  setProperty: (prop: Property) => void;

  setArgs: (args: unknown[] | undefined) => void;

  finish: (returnValue: ReturnValue) => Expectation;

  toString: () => string;
}

export type ExpectationFactory = (
  property: Property,
  args: any[] | undefined,
  returnValue: ReturnValue,
  concreteMatcher: ConcreteMatcher,
  exactParams: boolean
) => Expectation;

export class PendingExpectationWithFactory implements PendingExpectation {
  private args: unknown[] | undefined;

  private property: Property | undefined;

  constructor(
    private createExpectation: ExpectationFactory,
    private concreteMatcher: ConcreteMatcher,
    private exactParams: boolean
  ) {}

  setProperty(value: Property) {
    if (this.property) {
      throw new UnfinishedExpectation(this);
    }

    this.property = value;
  }

  setArgs(value: unknown[] | undefined) {
    this.args = value;
  }

  finish(returnValue: ReturnValue): Expectation {
    if (!this.property) {
      throw new MissingWhen();
    }

    const expectation = this.createExpectation(
      this.property,
      this.args,
      returnValue,
      this.concreteMatcher,
      this.exactParams
    );

    this.property = undefined;
    this.args = undefined;

    return expectation;
  }

  toString() {
    return printWhen(this.property!, this.args);
  }
}
