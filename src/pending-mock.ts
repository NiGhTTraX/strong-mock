import { MissingReturnValue } from './errors';
import { ExpectationRepository } from './expectation-repository';

class PendingMock {
  private _repo: ExpectationRepository | undefined;

  get repo(): ExpectationRepository | undefined {
    return this._repo;
  }

  set repo(value: ExpectationRepository | undefined) {
    if (this._repo) {
      throw new MissingReturnValue();
    }

    this._repo = value;
  }

  public args: any[] | undefined;

  public property: string = '';

  clear() {
    this._repo = undefined;
    this.args = undefined;
    this.property = '';
  }
}

export const pendingMock = new PendingMock();
