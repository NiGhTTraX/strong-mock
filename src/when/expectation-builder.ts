import { MissingWhen, UnfinishedExpectation } from '../errors/api';
import type { Expectation } from '../expectation/expectation';
import type { ReturnValue } from '../expectation/repository/return-value';
import type { ConcreteMatcher } from '../mock/options';
import type { Property } from '../proxy';

/**
 * An expectation has to be built incrementally, starting first with the property
 * being accessed inside {@link createStub}, then any arguments passed to it, and ending
 * it with the returned value from {@link createReturns}.
 */
export interface ExpectationBuilder {
  setProperty: (prop: Property) => void;

  setArgs: (args: unknown[] | undefined) => void;

  finish: (returnValue: ReturnValue) => Expectation;
}

export type ExpectationFactory = (
  property: Property,
  args: any[] | undefined,
  returnValue: ReturnValue,
  concreteMatcher: ConcreteMatcher,
  exactParams: boolean,
) => Expectation;

export class ExpectationBuilderWithFactory implements ExpectationBuilder {
  private args: unknown[] | undefined;

  private property: Property | undefined;

  constructor(
    private createExpectation: ExpectationFactory,
    private concreteMatcher: ConcreteMatcher,
    private exactParams: boolean,
  ) {}

  setProperty(value: Property) {
    if (this.property) {
      throw new UnfinishedExpectation(this.property, this.args);
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
      this.exactParams,
    );

    this.property = undefined;
    this.args = undefined;

    return expectation;
  }
}
