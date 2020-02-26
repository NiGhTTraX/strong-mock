import { expect } from 'tdd-buffet/expect/jest';
import { beforeEach, describe, it } from 'tdd-buffet/suite/node';
import { instance } from '../src';
import { ExpectationRepository } from '../src/expectation-repository';
import { MethodExpectation } from '../src/expectations';
import { ApplyProp, MockMap, strongMock } from '../src/mock';

describe('instance', () => {
  beforeEach(() => {
    MockMap.clear();
  });

  it('get matching expectation for apply', () => {
    const mock = strongMock<(x: number) => number>();
    const repo = new ExpectationRepository();

    MockMap.set(mock, repo);

    repo.addExpectation(new MethodExpectation([1], 2, ApplyProp));

    expect(instance(mock)(1)).toEqual(2);
  });

  it('get matching expectation for method', () => {
    const mock = strongMock<{ bar: (x: number) => number }>();
    const repo = new ExpectationRepository();

    MockMap.set(mock, repo);

    repo.addExpectation(new MethodExpectation([1], 2, 'bar'));

    expect(instance(mock).bar(1)).toEqual(2);
  });
});
