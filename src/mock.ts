import { ExpectationRepository } from './expectation-repository';
import { pendingMock } from './pending-mock';
import { createProxy } from './proxy';

export const MockMap = new Map<Mock<unknown>, ExpectationRepository>();

export type Mock<T> = T;

export const strongMock = <T>(): Mock<T> => {
  const repo = new ExpectationRepository();

  pendingMock.clear();

  const stub = createProxy({
    get: (args, property: string) => {
      pendingMock.repo = repo;
      pendingMock.args = args;
      pendingMock.property = property;
    },
    apply: (argArray?: any) => {
      pendingMock.repo = repo;
      pendingMock.args = argArray;
    }
  });

  MockMap.set(stub, repo);

  return (stub as unknown) as Mock<T>;
};
