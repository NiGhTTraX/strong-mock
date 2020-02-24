import { ExpectationRepository } from './expectation-repository';
import { PendingExpectation } from './pending-expectation';
import { createProxy } from './proxy';

export const MockMap = new Map<Mock<unknown>, ExpectationRepository>();

export type Mock<T> = T;

export const strongMock = <T>(): Mock<T> => {
  const repo = new ExpectationRepository();
  const pendingExpectation = new PendingExpectation();

  const stub = createProxy({
    property: (property: string) => {
      pendingExpectation.start(repo);
      pendingExpectation.setProperty(property);

      return pendingExpectation;
    },

    method: (args, property) => {
      // TODO: this should not be needed
      pendingExpectation.setProperty(property);
      pendingExpectation.setArgs(args);

      return pendingExpectation;
    },

    apply: (argArray?: any) => {
      pendingExpectation.start(repo);
      pendingExpectation.setProperty('');
      pendingExpectation.setArgs(argArray);

      return pendingExpectation;
    }
  });

  MockMap.set(stub, repo);

  return (stub as unknown) as Mock<T>;
};
