import { UnexpectedAccess, UnexpectedCall } from './errors';
import { Expectation } from './expectation';
import { ExpectationRepository } from './expectation-repository';
import { ApplyProp, getRepoForMock, Mock } from './mock';
import { createProxy } from './proxy';

const returnOrThrow = (expectation: Expectation) => {
  const { returnValue } = expectation;

  if (returnValue instanceof Error) {
    throw returnValue;
  }

  return returnValue;
};

const findAndReturn = (
  repo: ExpectationRepository,
  args: any[],
  property: PropertyKey
) => {
  const expectation = repo.findAndConsume(property, args);

  if (!expectation) {
    throw new UnexpectedCall(property, args, repo.getUnmet());
  }

  return returnOrThrow(expectation);
};

export const instance = <T>(mock: Mock<T>): T => {
  const repo = getRepoForMock(mock);

  return createProxy<T>({
    property: property => {
      if (!repo.hasFor(property)) {
        throw new UnexpectedAccess(property, repo.getUnmet());
      }

      const propertyExpectation = repo.findAndConsume(property, undefined);

      if (propertyExpectation) {
        return returnOrThrow(propertyExpectation);
      }

      return (...args: any[]) => findAndReturn(repo, args, property);
    },
    apply: (args: any[]) => {
      return findAndReturn(repo, args, ApplyProp);
    }
  });
};
