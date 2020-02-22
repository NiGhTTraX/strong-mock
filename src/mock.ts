import { MissingReturnValue } from './errors';
import {
  ExpectationList,
  ExpectationRepository
} from './expectation-repository';
import { createProxy } from './proxy';

export const MockMap = new Map<Mock<unknown>, ExpectationRepository>();

export type Mock<T> = T;

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

export const strongMock = <T>(): Mock<T> => {
  const methodRepo = new ExpectationList();
  const applyRepo = new ExpectationList();

  pendingMock.clear();

  const stub = createProxy({
    get: (args, property: string) => {
      pendingMock.repo = methodRepo;
      pendingMock.args = args;
      pendingMock.property = property;
    },
    apply: (argArray?: any) => {
      pendingMock.repo = applyRepo;
      pendingMock.args = argArray;
    }
  });

  MockMap.set(stub, { apply: applyRepo, methods: methodRepo });

  return (stub as unknown) as Mock<T>;
};
