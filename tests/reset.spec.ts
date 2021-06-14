/* eslint-disable class-methods-use-this */
import { expect } from 'tdd-buffet/expect/jest';
import { describe, it } from 'tdd-buffet/suite/node';
import { when } from '../src';
import { mock } from '../src/mock/mock';
import { reset } from '../src/verify/reset';
import { StrongRepository } from '../src/repository/strong-repository';

describe('reset', () => {
  it('should clear the expectation repo', () => {
    const repo = new StrongRepository();
    const fn = mock<() => void>({ repository: repo });

    when(fn()).thenReturn(undefined);
    reset(fn);

    expect(repo.getUnmet()).toHaveLength(0);
  });
});
