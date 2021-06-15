/* eslint-disable class-methods-use-this */
import { expect } from 'tdd-buffet/expect/jest';
import { describe, it } from 'tdd-buffet/suite/node';
import { when } from '../index';
import { mock } from '../mock/mock';
import { reset } from './reset';
import { StrongRepository } from '../expectation/repository/strong-repository';

describe('reset', () => {
  it('should clear the expectation repo', () => {
    const repo = new StrongRepository();
    const fn = mock<() => void>({ repository: repo });

    when(fn()).thenReturn(undefined);
    reset(fn);

    expect(repo.getUnmet()).toHaveLength(0);
  });
});
