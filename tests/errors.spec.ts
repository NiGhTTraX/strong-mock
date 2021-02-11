/* eslint-disable class-methods-use-this */
import { describe, it } from 'tdd-buffet/suite/node';
import {
  NestedWhen,
  UnexpectedAccess,
  UnexpectedCall,
  UnexpectedCalls,
  UnfinishedExpectation,
  UnmetExpectations,
} from '../src/errors';
import { CallMap } from '../src/expectation-repository';
import { RepoSideEffectPendingExpectation } from '../src/pending-expectation';
import { expectAnsilessContain, expectAnsilessEqual } from './ansiless';
import { EmptyRepository } from './expectation-repository';
import {
  NeverMatchingExpectation,
  NotMatchingExpectation,
  spyExpectationFactory,
  SpyPendingExpectation,
} from './expectations';

describe('errors', () => {
  describe('PendingExpectation', () => {
    it('should print call', () => {
      const pendingExpectation = new RepoSideEffectPendingExpectation(
        spyExpectationFactory
      );

      pendingExpectation.start(new EmptyRepository());
      pendingExpectation.args = [1, 2, 3];
      pendingExpectation.property = 'bar';

      expectAnsilessEqual(
        pendingExpectation.toJSON(),
        `when(mock.bar(1, 2, 3))`
      );
    });

    it('should print property access', () => {
      const pendingExpectation = new RepoSideEffectPendingExpectation(
        spyExpectationFactory
      );

      pendingExpectation.start(new EmptyRepository());
      pendingExpectation.args = undefined;
      pendingExpectation.property = 'bar';

      expectAnsilessEqual(pendingExpectation.toJSON(), `when(mock.bar)`);
    });
  });

  describe('UnfinishedExpectation', () => {
    it('should print the pending expectation', () => {
      const pendingExpectation = new SpyPendingExpectation();
      pendingExpectation.args = [1, 2, 3];
      pendingExpectation.property = 'bar';
      pendingExpectation.toJSON = () => 'foobar';

      expectAnsilessContain(
        new UnfinishedExpectation(pendingExpectation).message,
        `There is an unfinished pending expectation:

foobar`
      );
    });
  });

  describe('UnmetExpectations', () => {
    it('should print all expectations', () => {
      const expectation1 = new NeverMatchingExpectation();
      expectation1.toJSON = () => 'e1';
      const expectation2 = new NeverMatchingExpectation();
      expectation2.toJSON = () => 'e2';

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
      e1.toJSON = () => 'e1';
      e2.toJSON = () => 'e2';
      const error = new UnexpectedAccess('bar', [e1, e2]);

      expectAnsilessContain(
        error.message,
        `Didn't expect mock.bar to be accessed.`
      );

      expectAnsilessContain(
        error.message,
        `Remaining unmet expectations:
 - e1
 - e2`
      );
    });
  });

  describe('UnexpectedCall', () => {
    it('should print the property and the existing expectations', () => {
      const e1 = new NeverMatchingExpectation();
      const e2 = new NeverMatchingExpectation();
      e1.toJSON = () => 'e1';
      e2.toJSON = () => 'e2';
      const error = new UnexpectedCall('bar', [1, 2, 3], [e1, e2]);

      expectAnsilessContain(
        error.message,
        `Didn't expect mock.bar(1, 2, 3) to be called.`
      );

      expectAnsilessContain(
        error.message,
        `Remaining unmet expectations:
 - e1
 - e2`
      );
    });
  });

  describe('UnexpectedCalls', () => {
    it('should print the unexpected calls and remaining expectations', () => {
      const e1 = new NotMatchingExpectation(':irrelevant:', {
        value: undefined,
      });
      const e2 = new NotMatchingExpectation(':irrelevant:', {
        value: undefined,
      });
      e1.toJSON = () => 'e1';
      e2.toJSON = () => 'e2';

      const error = new UnexpectedCalls(
        new Map([
          [
            'foo',
            [
              { arguments: undefined },
              { arguments: [1, 2, 3] },
              { arguments: undefined },
              { arguments: [4, 5, 6] },
            ],
          ],
          ['bar', [{ arguments: undefined }]],
        ]) as CallMap,
        [e1, e2]
      );

      expectAnsilessContain(
        error.message,
        `The following calls were unexpected:

 - mock.foo(1, 2, 3)
 - mock.foo(4, 5, 6)
 - mock.bar`
      );

      expectAnsilessContain(
        error.message,
        `Remaining unmet expectations:
 - e1
 - e2`
      );
    });
  });

  describe('NestedWhen', () => {
    it('should print the nested property', () => {
      const error = new NestedWhen('foo', Symbol('bar'));

      expectAnsilessContain(error.message, `when(parentMock.foo)`);
      expectAnsilessContain(error.message, `when(childMock[Symbol(bar)])`);
    });
  });
});
