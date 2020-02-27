import { expect } from 'tdd-buffet/expect/jest';
import { beforeEach, describe, it } from 'tdd-buffet/suite/node';
import { strongMock } from '../src';
import { UnmetExpectation } from '../src/errors';
import { Expectation } from '../src/expectation';
import { ApplyProp, MOCK_MAP } from '../src/mock';
import { SINGLETON_PENDING_EXPECTATION } from '../src/pending-expectation';
import { verifyAll } from '../src/verify';
import {
  EmptyRepository,
  OneExistingExpectationRepository
} from './expectation-repository';

describe('verifyAll', () => {
  beforeEach(() => {
    SINGLETON_PENDING_EXPECTATION.clear();
  });

  it('should throw if remaining expectations', () => {
    const repo = new OneExistingExpectationRepository(
      new Expectation(ApplyProp, [], 23)
    );
    const mock = strongMock<() => number>();

    MOCK_MAP.set(mock, repo);

    expect(() => verifyAll(mock)).toThrow(UnmetExpectation);
  });

  it('should not throw if all expectations met', () => {
    const repo = new EmptyRepository();
    const mock = strongMock<() => number>();

    MOCK_MAP.set(mock, repo);

    expect(() => verifyAll(mock)).not.toThrow();
  });
});
