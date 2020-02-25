import { ExpectationRepository } from './expectation-repository';
import { PendingExpectation } from './pending-expectation';
import { createProxy } from './proxy';

export const MockMap = new Map<Mock<unknown>, ExpectationRepository>();

export type Mock<T> = T;

export const createStub = <T>(repo: ExpectationRepository): Mock<T> => {
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

  return (stub as unknown) as Mock<T>;
};

export const strongMock = <T>(): Mock<T> => {
  const repo = new ExpectationRepository();
  const stub = createStub<T>(repo);

  MockMap.set(stub, repo);

  return stub;
};
