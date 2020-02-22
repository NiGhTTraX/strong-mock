import { MissingReturnValue } from './errors';
import { ExpectationList } from './expectation-repository';

class PendingMock {
  private _repo: ExpectationList | undefined;

  get repo(): ExpectationList | undefined {
    return this._repo;
  }

  set repo(value: ExpectationList | undefined) {
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
