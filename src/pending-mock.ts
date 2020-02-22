import { MissingReturnValue, MissingWhen } from './errors';
import { ExpectationRepository } from './expectation-repository';
import { MethodExpectation } from './expectations';

class PendingMock {
  private _repo: ExpectationRepository | undefined;

  private args: any[] | undefined;

  private property: string = '';

  start(repo: ExpectationRepository) {
    if (this._repo) {
      throw new MissingReturnValue();
    }

    this._repo = repo;
  }

  setPendingMethod(property: string, args: any[]) {
    this.args = args;
    this.property = property;
  }

  setPendingApply(args: any[]) {
    this.property = '';
    this.args = args;
  }

  finish(returnValue: any) {
    if (!this._repo || !this.args) {
      throw new MissingWhen();
    }

    this._repo.addExpectation(
      new MethodExpectation(this.args, returnValue, this.property)
    );

    this.clear();
  }

  clear() {
    this._repo = undefined;
    this.args = undefined;
    this.property = '';
  }
}

export const pendingMock = new PendingMock();
