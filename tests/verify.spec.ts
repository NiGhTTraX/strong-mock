import { expect } from 'tdd-buffet/expect/jest';
import { describe, it } from 'tdd-buffet/suite/node';
import { mock } from '../src';
import { UnmetExpectation } from '../src/errors';
import { verify } from '../src/verify';
import {
  EmptyRepository,
  OneExistingExpectationRepository
} from './expectation-repository';
import { OneUseAlwaysMatchingExpectation } from './expectations';

describe('verifyAll', () => {
  it('should throw if remaining expectations', () => {
    const repo = new OneExistingExpectationRepository(
      new OneUseAlwaysMatchingExpectation()
    );
    const fn = mock<() => number>(repo);

    expect(() => verify(fn)).toThrow(UnmetExpectation);
  });

  it('should not throw if all expectations met', () => {
    const repo = new EmptyRepository();
    const fn = mock<() => number>(repo);

    expect(() => verify(fn)).not.toThrow();
  });
});
