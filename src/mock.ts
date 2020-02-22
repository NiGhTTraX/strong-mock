import { ExpectationRepository } from './expectation-repository';
import { pendingExpectation } from './pending-expectation';
import { createProxy } from './proxy';

export const MockMap = new Map<Mock<unknown>, ExpectationRepository>();

export type Mock<T> = T;

export const strongMock = <T>(): Mock<T> => {
  const repo = new ExpectationRepository();

  pendingExpectation.clear();

  const stub = createProxy({
    get: (args, property: string) => {
      pendingExpectation.start(repo);
      pendingExpectation.setPendingMethod(property, args);
    },
    apply: (argArray?: any) => {
      pendingExpectation.start(repo);
      pendingExpectation.setPendingApply(argArray);
    }
  });

  MockMap.set(stub, repo);

  return (stub as unknown) as Mock<T>;
};
