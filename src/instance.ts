import { UnexpectedCall } from './errors';
import { ExpectationRepository } from './expectation-repository';
import { ApplyProp, getRepoForMock, Mock } from './mock';
import { createProxy } from './proxy';

const returnOrThrow = (
  repo: ExpectationRepository,
  args: any[] | undefined,
  property: PropertyKey
) => {
  const expectation = repo.find(args, property);

  if (!expectation) {
    throw new UnexpectedCall(property);
  }

  return expectation.returnValue;
};

export const instance = <T>(mock: Mock<T>): T => {
  const repo = getRepoForMock(mock);

  return createProxy<T>({
    property: property => {
      if (!repo.hasFor(property)) {
        throw new UnexpectedCall(property);
      }

      const propertyExpectation = repo.find(undefined, property);

      if (propertyExpectation) {
        return propertyExpectation.returnValue;
      }

      return (...args: any[]) => returnOrThrow(repo, args, property);
    },
    apply: (argArray: any | undefined) => {
      return returnOrThrow(repo, argArray, ApplyProp);
    }
  });
};
