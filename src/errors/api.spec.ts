import { expectAnsilessContain } from '../../tests/ansiless';
import { SpyPendingExpectation } from '../expectation/expectation.mocks';
import { NestedWhen, UnfinishedExpectation } from './api';

describe('API errors', () => {
  describe('UnfinishedExpectation', () => {
    it('should print the pending expectation', () => {
      const pendingExpectation = new SpyPendingExpectation();
      pendingExpectation.setArgs([1, 2, 3]);
      pendingExpectation.setProperty('bar');
      pendingExpectation.toJSON = () => 'foobar';

      expectAnsilessContain(
        new UnfinishedExpectation(pendingExpectation).message,
        `There is an unfinished pending expectation:

foobar`
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
