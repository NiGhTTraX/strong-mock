import { beforeEach, describe, expect, it } from 'vitest';
import { SM } from '../../tests/old';
import { UnexpectedCalls, UnmetExpectations } from '../errors/verify';
import { NotMatchingExpectation } from '../expectation/expectation.mocks';
import type { ExpectationRepository } from '../expectation/repository/expectation-repository';
import { mock, verify, when } from '../index';
import { resetAll } from './reset';
import { verifyAll, verifyRepo } from './verify';

describe('verify', () => {
  it('should throw on unexpected calls', () => {
    const fn = mock<() => void>();

    try {
      fn();
      // eslint-disable-next-line no-empty
    } catch (e) {}

    expect(() => verify(fn)).toThrow(UnexpectedCalls);
  });
});

describe('verifyAll', () => {
  beforeEach(() => {});

  it('should verify all mocks', () => {
    resetAll();

    const fn = mock<() => void>();

    when(() => fn()).thenReturn(undefined);

    expect(() => verifyAll()).toThrow(UnmetExpectations);
  });
});

describe('verifyRepo', () => {
  it('should throw if remaining expectations', () => {
    const repo = SM.mock<ExpectationRepository>();

    SM.when(() => repo.getUnmet()).thenReturn([
      new NotMatchingExpectation(':irrelevant:', { value: undefined }),
    ]);

    expect(() => verifyRepo(repo)).toThrow(UnmetExpectations);
  });

  it('should throw if unexpected calls', () => {
    const repo = SM.mock<ExpectationRepository>();

    SM.when(() => repo.getUnmet()).thenReturn([]);
    SM.when(() => repo.getCallStats()).thenReturn({
      unexpected: new Map([['bar', [{ arguments: [] }]]]),
      expected: new Map(),
    });

    expect(() => verifyRepo(repo)).toThrow(UnexpectedCalls);
  });
});
