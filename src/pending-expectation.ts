import { MissingReturnValue, MissingWhen } from './errors';
import { Expectation } from './expectation';
import { ExpectationRepository } from './expectation-repository';

export class PendingExpectation {
  private _repo: ExpectationRepository | undefined;

  private _args: any[] | undefined;

  private _property: string = '';

  start(repo: ExpectationRepository) {
    if (this._repo) {
      throw new MissingReturnValue();
    }

    this.clear();

    this._repo = repo;
  }

  set property(value: string) {
    this._property = value;
  }

  set args(value: any[] | undefined) {
    this._args = value;
  }

  finish(returnValue: any): Expectation {
    if (!this._repo) {
      throw new MissingWhen();
    }

    const expectation = new Expectation(
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

export const SINGLETON_PENDING_EXPECTATION = new PendingExpectation();
