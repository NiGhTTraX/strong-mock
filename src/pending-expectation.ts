import { MissingReturnValue, MissingWhen } from './errors';
import { ExpectationRepository } from './expectation-repository';
import { MethodExpectation } from './expectations';

export class PendingExpectation {
  get args(): any[] | undefined {
    return this._args;
  }

  set args(value: any[] | undefined) {
    this._args = value;
  }

  get property(): string {
    return this._property;
  }

  set property(value: string) {
    this._property = value;
  }

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

  setPendingMethod(property: string, args: any[]) {
    this._args = args;
    this._property = property;
  }

  setPendingApply(args: any[]) {
    this._property = '';
    this._args = args;
  }

  finish(returnValue: any) {
    if (!this._repo || !this._args) {
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
