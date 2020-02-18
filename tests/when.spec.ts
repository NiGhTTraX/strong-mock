import { describe, it } from 'tdd-buffet/suite/node';
import { strongMock, when } from '../src';

describe('when', () => {
  it('should do nothing without a chained return', () => {
    const mock = strongMock<() => void>();

    when(mock());
  });
});
