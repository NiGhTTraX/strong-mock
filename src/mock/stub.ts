import { NestedWhen } from '../errors/api';
import { ApplyProp } from '../expectation/expectation';
import type { ExpectationRepository } from '../expectation/repository/expectation-repository';
import type { Property } from '../proxy';
import { createProxy } from '../proxy';
import type { PendingExpectation } from '../when/pending-expectation';
import { setActiveMock } from './map';
import type { Mock } from './mock';
import { Mode } from './mock';

export const createStub = <T>(
  repo: ExpectationRepository,
  pendingExpectation: PendingExpectation,
  getCurrentMode: () => Mode
): Mock<T> => {
  const stub = createProxy<T>({
    property: (property) => {
      if (getCurrentMode() === Mode.CALL) {
        return repo.get(property);
      }

      setActiveMock(stub);

      pendingExpectation.setProperty(property);

      return createProxy({
        property: (childProp: Property) => {
          throw new NestedWhen(property, childProp);
        },
        apply: (args: unknown[]) => {
          pendingExpectation.setArgs(args);
        },
        ownKeys: () => {
          throw new Error('Spreading during an expectation is not supported.');
        },
      });
    },
    apply: (args: unknown[]) => {
      if (getCurrentMode() === Mode.CALL) {
        return repo.apply(args);
      }

      setActiveMock(stub);

      pendingExpectation.setProperty(ApplyProp);
      pendingExpectation.setArgs(args);

      return undefined;
    },
    ownKeys: () => {
      if (getCurrentMode() === Mode.CALL) {
        return repo.getAllProperties();
      }

      throw new Error('Spreading during an expectation is not supported.');
    },
  });

  return stub;
};
