import { UnexpectedAccess, UnexpectedCall } from './errors';
import { ApplyProp, Expectation } from './expectation';
import { ExpectationRepository } from './expectation-repository';
import { getMockState } from './map';
import { Mock } from './mock';
import { createProxy } from './proxy';

/**
 * Return the expectation's return value. If the value is an error then
 * throw it.
 */
const returnOrThrow = (expectation: Expectation) => {
  const { returnValue } = expectation;

  if (returnValue instanceof Error) {
    throw returnValue;
  }

  return returnValue;
};

/**
 * Find a matching expectation and return its return value.
 */
const getAndReturn = (
  repo: ExpectationRepository,
  args: any[],
  property: PropertyKey
) => {
  const expectation = repo.get(property, args);

  if (!expectation) {
    throw new UnexpectedCall(property, args, repo.getUnmet());
  }

  return returnOrThrow(expectation);
};

/**
 * Get a real instance from the mock that you can pass to your code under test.
 */
export const instance = <T>(mock: Mock<T>): T => {
  const { repository } = getMockState(mock);

  return createProxy<T>({
    property: property => {
      if (!repository.hasKey(property)) {
        throw new UnexpectedAccess(property, repository.getUnmet());
      }

      const propertyExpectation = repository.get(property, undefined);

      if (propertyExpectation) {
        return returnOrThrow(propertyExpectation);
      }

      return (...args: any[]) => getAndReturn(repository, args, property);
    },
    apply: (args: any[]) => {
      return getAndReturn(repository, args, ApplyProp);
    }
  });
};
