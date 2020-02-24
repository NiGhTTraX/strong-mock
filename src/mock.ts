import { ExpectationRepository } from './expectation-repository';
import { PendingExpectation } from './pending-expectation';
import { createProxy } from './proxy';

export const MockMap = new Map<Mock<unknown>, ExpectationRepository>();

export type Mock<T> = T;

export const strongMock = <T>(): Mock<T> => {
  const repo = new ExpectationRepository();
  const pendingExpectation = new PendingExpectation();

  const stub = createProxy({
    get: (args, property: string) => {
      pendingExpectation.start(repo);
      pendingExpectation.setPendingMethod(property, args);

      return pendingExpectation;
    },
    apply: (argArray?: any) => {
      pendingExpectation.start(repo);
      pendingExpectation.setPendingApply(argArray);

      return pendingExpectation;
    }
  });

  MockMap.set(stub, repo);

  return (stub as unknown) as Mock<T>;
};
