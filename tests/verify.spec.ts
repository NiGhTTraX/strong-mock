/* eslint-disable class-methods-use-this */
import { expect } from 'tdd-buffet/expect/jest';
import { describe, it } from 'tdd-buffet/suite/node';
import { mock } from '../src';
import { UnexpectedCalls, UnmetExpectations } from '../src/errors';
import { Expectation2 } from '../src/expectation';
import { CallMap, ExpectationRepository2 } from '../src/expectation-repository';
import { verify, verify3 } from '../src/verify';
import {
  EmptyRepository,
  OneExistingExpectationRepository,
} from './expectation-repository';
import {
  NotMatchingExpectation,
  OneUseAlwaysMatchingExpectation,
} from './expectations';

describe('verify', () => {
  it('should throw if remaining expectations', () => {
    const repo = new OneExistingExpectationRepository(
      new OneUseAlwaysMatchingExpectation()
    );
    const fn = mock<() => number>({ repository: repo });

    expect(() => verify(fn)).toThrow(UnmetExpectations);
  });

  it('should not throw if all expectations met', () => {
    const repo = new EmptyRepository();
    const fn = mock<() => number>({ repository: repo });

    expect(() => verify(fn)).not.toThrow();
  });
});

describe('verify2', () => {
  class MockRepo implements ExpectationRepository2 {
    private readonly unmet: Expectation2[] = [];

    private readonly unexpected: CallMap = new Map();

    private readonly expected: CallMap = new Map();

    constructor({
      expected = new Map(),
      unexpected = new Map(),
      unmet = [],
    }: {
      expected?: CallMap;
      unexpected?: CallMap;
      unmet?: Expectation2[];
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
      verify3(
        new MockRepo({
          unmet: [new NotMatchingExpectation(':irrelevant:', undefined)],
        })
      )
    ).toThrow(UnmetExpectations);
  });

  it('should throw if unexpected calls', () => {
    expect(() =>
      verify3(
        new MockRepo({
          unexpected: new Map([['bar', [{ arguments: [] }]]]) as CallMap,
        })
      )
    ).toThrow(UnexpectedCalls);
  });
});
