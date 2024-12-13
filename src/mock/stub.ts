import { NestedWhen } from '../errors/api.js';
import { ApplyProp } from '../expectation/expectation.js';
import type { ExpectationRepository } from '../expectation/repository/expectation-repository.js';
import type { Property } from '../proxy.js';
import { createProxy } from '../proxy.js';
import type { ExpectationBuilder } from '../when/expectation-builder.js';
import { setActiveMock } from './map.js';
import type { Mock } from './mock.js';
import { Mode } from './mode.js';

export const createStub = <T>(
  repo: ExpectationRepository,
  builder: ExpectationBuilder,
  getCurrentMode: () => Mode,
): Mock<T> => {
  const stub = createProxy<T>({
    property: (property) => {
      if (getCurrentMode() === Mode.CALL) {
        return repo.get(property);
      }

      setActiveMock(stub);

      builder.setProperty(property);

      return createProxy({
        property: (childProp: Property) => {
          throw new NestedWhen(property, childProp);
        },
        apply: (args: unknown[]) => {
          builder.setArgs(args);
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

      builder.setProperty(ApplyProp);
      builder.setArgs(args);

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
