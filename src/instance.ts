import { MissingMock } from './errors';
import { ApplyProp, Mock, MockMap } from './mock';
import { createProxy } from './proxy';

export const instance = <T>(mock: Mock<T>): T => {
  const repo = MockMap.get(mock);

  if (!repo) {
    throw new MissingMock();
  }

  return createProxy<T>({
    property: (property: string) => {
      const propertyExpectation = repo.findFirst(undefined, property);

      if (propertyExpectation) {
        repo.remove(propertyExpectation);
        return propertyExpectation.returnValue;
      }

      return (...args: any[]) => repo.getFirst(args, property).returnValue;
    },
    apply: (argArray: any | undefined) =>
      repo.getFirst(argArray, ApplyProp).returnValue
  });
};
