/* eslint-disable class-methods-use-this */
import { describe, it } from 'tdd-buffet/suite/node';
import {
  UnexpectedAccess,
  UnexpectedCall,
  UnfinishedExpectation,
  UnmetExpectations
} from '../src/errors';
import { SingletonPendingExpectation } from '../src/pending-expectation';
import { expectAnsilessEqual } from './ansiless';
import { EmptyRepository } from './expectation-repository';
import {
  NeverMatchingExpectation,
  spyExpectationFactory,
  SpyPendingExpectation
} from './expectations';

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

Please finish it by setting a return value.`
      );
    });
  });

  describe('UnmetExpectations', () => {
    it('should print all expectations', () => {
      const expectation1 = new NeverMatchingExpectation();
      expectation1.toString = () => 'e1';
      const expectation2 = new NeverMatchingExpectation();
      expectation2.toString = () => 'e2';

      const error = new UnmetExpectations([expectation1, expectation2]);

      expectAnsilessEqual(
        error.message,
        `There are unmet expectations:

 - e1
 - e2`
      );
    });
  });

  describe('UnexpectedAccess', () => {
    it('should print the property and the existing expectations', () => {
      const e1 = new NeverMatchingExpectation();
      const e2 = new NeverMatchingExpectation();
      e1.toString = () => 'e1';
      e2.toString = () => 'e2';
      const error = new UnexpectedAccess('bar', [e1, e2]);

      expectAnsilessEqual(
        error.message,
        `Didn't expect mock.bar to be accessed.

Remaining unmet expectations:
 - e1
 - e2`
      );
    });
  });

  describe('UnexpectedCall', () => {
    it('should print the property and the existing expectations', () => {
      const e1 = new NeverMatchingExpectation();
      const e2 = new NeverMatchingExpectation();
      e1.toString = () => 'e1';
      e2.toString = () => 'e2';
      const error = new UnexpectedCall('bar', [1, 2, 3], [e1, e2]);

      expectAnsilessEqual(
        error.message,
        `Didn't expect mock.bar(1, 2, 3) to be called.

Remaining unmet expectations:
 - e1
 - e2`
      );
    });
  });
});
