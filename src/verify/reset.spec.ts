/* eslint-disable class-methods-use-this */
import { StrongRepository } from '../expectation/repository/strong-repository';
import { when } from '../index';
import { mock } from '../mock/mock';
import { reset } from './reset';

describe('reset', () => {
  it('should clear the expectation repo', () => {
    const repo = new StrongRepository();
    const fn = mock<() => void>({ repository: repo });

    when(() => fn()).thenReturn(undefined);
    reset(fn);

    expect(repo.getUnmet()).toHaveLength(0);
  });
});
