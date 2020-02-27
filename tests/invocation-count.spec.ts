import { beforeEach, describe, it } from 'tdd-buffet/suite/node';
import { when } from '../src';
import { Expectation } from '../src/expectation';
import { SINGLETON_PENDING_EXPECTATION } from '../src/pending-expectation';
import { OneIncomingExpectationRepository } from './expectation-repository';

describe('invocation count', () => {
  beforeEach(() => {
    SINGLETON_PENDING_EXPECTATION.clear();
  });

  it('when should set the min and max', () => {
    const repo = new OneIncomingExpectationRepository();

    SINGLETON_PENDING_EXPECTATION.start(repo);
    SINGLETON_PENDING_EXPECTATION.property = 'bar';
    SINGLETON_PENDING_EXPECTATION.args = [];

    when(1)
      .returns(23)
      .between(2, 8);

    expect(repo.expectation).toEqual(new Expectation('bar', [], 23, 2, 8));
  });
});
