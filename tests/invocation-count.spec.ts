import { beforeEach, describe, it } from 'tdd-buffet/suite/node';
import { when } from '../src';
import { Expectation } from '../src/expectation';
import { singletonPendingExpectation } from '../src/pending-expectation';
import { OneExpectationRepository } from './expectation-repository';

describe('invocation count', () => {
  beforeEach(() => {
    singletonPendingExpectation.clear();
  });

  it('when should set the min and max', () => {
    const repo = new OneExpectationRepository();

    singletonPendingExpectation.start(repo);
    singletonPendingExpectation.property = 'bar';
    singletonPendingExpectation.args = [];

    when(1)
      .returns(23)
      .between(2, 8);

    expect(repo.expectation).toEqual(new Expectation('bar', [], 23, 2, 8));
  });
});
