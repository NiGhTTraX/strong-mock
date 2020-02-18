import { expect } from 'tdd-buffet/expect/jest';
import { describe, it } from 'tdd-buffet/suite/node';
import { instance, MissingReturnValue, strongMock, when } from '../src';

describe('when', () => {
  it('should do nothing without a chained return', () => {
    const mock = strongMock<() => void>();

    when(mock());
  });

  it('should throw if previous expectation is missing return', () => {
    const mock = strongMock<() => void>();

    when(mock());

    expect(() => when(mock())).toThrow(MissingReturnValue);
  });

  it('should set an expectation with no args and no return', () => {
    const mock = strongMock<() => void>();

    when(mock()).returns(undefined);

    expect(instance(mock)()).toBeUndefined();
  });
});
