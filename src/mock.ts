import {
  ExpectationList,
  ExpectationRepository
} from './expectation-repository';
import { pendingMock } from './pending-mock';
import { createProxy } from './proxy';

export const MockMap = new Map<Mock<unknown>, ExpectationRepository>();

export type Mock<T> = T;

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
