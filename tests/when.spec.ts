import { expect } from 'tdd-buffet/expect/jest';
import { describe, it } from 'tdd-buffet/suite/node';
import { MissingReturnValue, strongMock, when } from '../src';

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
});
