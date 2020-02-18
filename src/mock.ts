import { ExpectationRepository } from './expectation-repository';

export const MockMap = new Map<Mock<unknown>, ExpectationRepository>();

export type Mock<T> = T;

class PendingMock {
  public repo: ExpectationRepository | undefined;

  public returnValue = false;

  public args: any[] | undefined;
}

export const pendingMock = new PendingMock();

export const strongMock = <T>(): Mock<T> => {
  const repo = new ExpectationRepository();
  pendingMock.returnValue = false;

  const stub = (((...args: any[]) => {
    pendingMock.repo = repo;
    pendingMock.args = args;
  }) as unknown) as Mock<T>;

  MockMap.set(stub, repo);

  return stub;
};
