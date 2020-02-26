import { MissingReturnValue, MissingWhen } from './errors';
import { ExpectationRepository } from './expectation-repository';
import { MethodExpectation } from './expectations';

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

  finish(returnValue: any) {
    if (!this._repo) {
      throw new MissingWhen();
    }

    this._repo.addExpectation(
      new MethodExpectation(this._args, returnValue, this._property)
    );

    this.clear();
  }

  clear() {
    this._repo = undefined;
    this._args = undefined;
    this._property = '';
  }
}

export const singletonPendingExpectation = new PendingExpectation();
