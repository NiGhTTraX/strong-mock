import {
  ExpectationList,
  ExpectationRepository
} from './expectation-repository';

export const MockMap = new Map<Mock<unknown>, ExpectationRepository>();

export type Mock<T> = T;

class PendingMock {
  public repo: ExpectationList | undefined;

  public returnValue = false;

  public args: any[] | undefined;

  public property: string = '';
}

export const pendingMock = new PendingMock();

function createProxy(methodRepo: ExpectationList, applyRepo: ExpectationList) {
  return new Proxy(() => {}, {
    get: (target, property: string) => {
      return (...args: any[]) => {
        pendingMock.repo = methodRepo;
        pendingMock.args = args;
        pendingMock.property = property;
      };
    },

    apply: (target: {}, thisArg: any, argArray?: any) => {
      pendingMock.repo = applyRepo;
      pendingMock.args = argArray;
    }
  });
}

export const strongMock = <T>(): Mock<T> => {
  const methodRepo = new ExpectationList();
  const applyRepo = new ExpectationList();
  // TODO: add clear method
  pendingMock.returnValue = false;

  const stub = createProxy(methodRepo, applyRepo);

  MockMap.set(stub, { apply: applyRepo, methods: methodRepo });

  return (stub as unknown) as Mock<T>;
};
