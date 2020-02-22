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
      pendingMock.start(repo);
      pendingMock.setPendingMethod(property, args);
    },
    apply: (argArray?: any) => {
      pendingMock.start(repo);
      pendingMock.setPendingApply(argArray);
    }
  });

  MockMap.set(stub, repo);

  return (stub as unknown) as Mock<T>;
};
