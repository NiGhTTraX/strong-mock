/* eslint-disable class-methods-use-this */
import { expect } from 'tdd-buffet/expect/jest';
import { beforeEach, describe, it } from 'tdd-buffet/suite/node';
import { instance, mock, verify, when } from '../index';
import { UnexpectedCalls, UnmetExpectations } from '../errors';
import { Expectation } from '../expectation/expectation';
import {
  CallMap,
  ExpectationRepository,
} from '../expectation/repository/expectation-repository';
import { resetAll } from './reset';
import { verifyAll, verifyRepo } from './verify';
import { NotMatchingExpectation } from '../expectation/expectation.mocks';

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
  class MockRepo implements ExpectationRepository {
    private readonly unmet: Expectation[] = [];

    private readonly unexpected: CallMap = new Map();

    private readonly expected: CallMap = new Map();

    constructor({
      expected = new Map(),
      unexpected = new Map(),
      unmet = [],
    }: {
      expected?: CallMap;
      unexpected?: CallMap;
      unmet?: Expectation[];
    } = {}) {
      // noinspection JSPotentiallyInvalidUsageOfThis
      this.expected = expected;
      // noinspection JSPotentiallyInvalidUsageOfThis
      this.unexpected = unexpected;
      // noinspection JSPotentiallyInvalidUsageOfThis
      this.unmet = unmet;
    }

    add = () => {};

    clear = () => {};

    get = () => {};

    getCallStats = () => ({
      expected: this.expected,
      unexpected: this.unexpected,
    });

    getUnmet = () => this.unmet;
  }

  it('should throw if remaining expectations', () => {
    expect(() =>
      verifyRepo(
        new MockRepo({
          unmet: [
            new NotMatchingExpectation(':irrelevant:', { value: undefined }),
          ],
        })
      )
    ).toThrow(UnmetExpectations);
  });

  it('should throw if unexpected calls', () => {
    expect(() =>
      verifyRepo(
        new MockRepo({
          unexpected: new Map([['bar', [{ arguments: [] }]]]) as CallMap,
        })
      )
    ).toThrow(UnexpectedCalls);
  });
});
