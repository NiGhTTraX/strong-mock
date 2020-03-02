/* eslint-disable class-methods-use-this */
import { describe, it } from 'tdd-buffet/suite/node';
import { UnfinishedExpectation } from '../src/errors';
import { SingletonPendingExpectation } from '../src/pending-expectation';
import { expectAnsilessEqual } from './ansiless';
import { EmptyRepository } from './expectation-repository';
import { spyExpectationFactory, SpyPendingExpectation } from './expectations';

describe('errors', () => {
  describe('PendingExpectation', () => {
    it('should print call', () => {
      const pendingExpectation = new SingletonPendingExpectation(
        spyExpectationFactory
      );

      pendingExpectation.start(new EmptyRepository());
      pendingExpectation.args = [1, 2, 3];
      pendingExpectation.property = 'bar';

      expectAnsilessEqual(
        pendingExpectation.toString(),
        `when(mock.bar(1, 2, 3))`
      );
    });

    it('should print property access', () => {
      const pendingExpectation = new SingletonPendingExpectation(
        spyExpectationFactory
      );

      pendingExpectation.start(new EmptyRepository());
      pendingExpectation.args = undefined;
      pendingExpectation.property = 'bar';

      expectAnsilessEqual(pendingExpectation.toString(), `when(mock.bar)`);
    });
  });

  describe('UnfinishedExpectation', () => {
    it('should print the pending expectation', () => {
      const pendingExpectation = new SpyPendingExpectation();
      pendingExpectation.args = [1, 2, 3];
      pendingExpectation.property = 'bar';
      pendingExpectation.toString = () => 'foobar';

      expectAnsilessEqual(
        new UnfinishedExpectation(pendingExpectation).message,
        `There is an unfinished pending expectation:

foobar

Please finish it by chaining the expectation with a returns call.`
      );
    });
  });
});
