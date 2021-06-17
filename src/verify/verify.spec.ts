/* eslint-disable class-methods-use-this */
import { expect } from 'tdd-buffet/expect/jest';
import { beforeEach, describe, it } from 'tdd-buffet/suite/node';
import { SM } from '../../tests/old';
import { UnexpectedCalls, UnmetExpectations } from '../errors';
import { NotMatchingExpectation } from '../expectation/expectation.mocks';
import {
  CallMap,
  ExpectationRepository,
} from '../expectation/repository/expectation-repository';
import { instance, mock, verify, when } from '../index';
import { resetAll } from './reset';
import { verifyAll, verifyRepo } from './verify';

describe('verify', () => {
  it('should throw on unexpected calls', () => {
    const fn = mock<() => void>();

    try {
      instance(fn)();
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

    when(fn()).thenReturn(undefined);

    expect(() => verifyAll()).toThrow(UnmetExpectations);
  });
});

describe('verifyRepo', () => {
  it('should throw if remaining expectations', () => {
    const repo = SM.mock<ExpectationRepository>();

    SM.when(repo.getUnmet()).thenReturn([
      new NotMatchingExpectation(':irrelevant:', { value: undefined }),
    ]);

    expect(() => verifyRepo(SM.instance(repo))).toThrow(UnmetExpectations);
  });

  it('should throw if unexpected calls', () => {
    const repo = SM.mock<ExpectationRepository>();

    SM.when(repo.getUnmet()).thenReturn([]);
    SM.when(repo.getCallStats()).thenReturn({
      unexpected: new Map([['bar', [{ arguments: [] }]]]) as CallMap,
      expected: new Map(),
    });

    expect(() => verifyRepo(SM.instance(repo))).toThrow(UnexpectedCalls);
  });
});
