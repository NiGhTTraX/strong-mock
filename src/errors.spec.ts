/* eslint-disable class-methods-use-this */
import stripAnsi from 'strip-ansi';
import { expect } from 'tdd-buffet/expect/jest';
import { describe, it } from 'tdd-buffet/suite/node';
import { EmptyRepository } from '../tests/expectation-repository';
import {
  spyExpectationFactory,
  SpyPendingExpectation
} from '../tests/expectations';
import { UnfinishedExpectation } from './errors';
import { ApplyProp } from './mock';
import { SingletonPendingExpectation } from './pending-expectation';

const expectAnsilessEqual = (actual: string, expected: string) => {
  expect(stripAnsi(actual)).toEqual(expected);
};

describe('errors', () => {
  describe('PendingExpectation', () => {
    it('should print method call', () => {
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

    it('should print function call', () => {
      const pendingExpectation = new SingletonPendingExpectation(
        spyExpectationFactory
      );

      pendingExpectation.start(new EmptyRepository());
      pendingExpectation.args = [1, 2, 3];
      pendingExpectation.property = ApplyProp;

      expectAnsilessEqual(pendingExpectation.toString(), `when(mock(1, 2, 3))`);
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

    it('should print symbol access', () => {
      const pendingExpectation = new SingletonPendingExpectation(
        spyExpectationFactory
      );

      pendingExpectation.start(new EmptyRepository());
      pendingExpectation.args = undefined;
      pendingExpectation.property = Symbol('bar');

      expectAnsilessEqual(
        pendingExpectation.toString(),
        `when(mock[Symbol(bar)])`
      );
    });

    it('should print symbol call', () => {
      const pendingExpectation = new SingletonPendingExpectation(
        spyExpectationFactory
      );

      pendingExpectation.start(new EmptyRepository());
      pendingExpectation.args = [1, 2, 3];
      pendingExpectation.property = Symbol('bar');

      expectAnsilessEqual(
        pendingExpectation.toString(),
        `when(mock[Symbol(bar)](1, 2, 3))`
      );
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
