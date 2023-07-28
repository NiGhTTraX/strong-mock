import { expectAnsilessContain } from '../../tests/ansiless';
import { NestedWhen, UnfinishedExpectation } from './api';

describe('API errors', () => {
  describe('UnfinishedExpectation', () => {
    it('should print the pending expectation', () => {
      expectAnsilessContain(
        new UnfinishedExpectation('bar', [1, 2, 3]).message,
        `There is an unfinished pending expectation:

when(() => mock.bar(1, 2, 3)`
      );
    });
  });

  describe('NestedWhen', () => {
    it('should print the nested property', () => {
      const error = new NestedWhen('foo', Symbol('bar'));

      expectAnsilessContain(error.message, `when(() => parentMock.foo)`);
      expectAnsilessContain(
        error.message,
        `when(() => childMock[Symbol(bar)])`
      );
    });
  });
});
