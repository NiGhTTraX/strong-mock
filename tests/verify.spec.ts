import { expect } from 'tdd-buffet/expect/jest';
import { describe, it } from 'tdd-buffet/suite/node';
import { mock } from '../src';
import { UnmetExpectation } from '../src/errors';
import { Expectation } from '../src/expectation';
import { ApplyProp } from '../src/mock';
import { verifyAll } from '../src/verify';
import {
  EmptyRepository,
  OneExistingExpectationRepository
} from './expectation-repository';

describe('verifyAll', () => {
  it('should throw if remaining expectations', () => {
    const repo = new OneExistingExpectationRepository(
      new Expectation(ApplyProp, [], 23)
    );
    const fn = mock<() => number>(repo);

    expect(() => verifyAll(fn)).toThrow(UnmetExpectation);
  });

  it('should not throw if all expectations met', () => {
    const repo = new EmptyRepository();
    const fn = mock<() => number>(repo);

    expect(() => verifyAll(fn)).not.toThrow();
  });
});
