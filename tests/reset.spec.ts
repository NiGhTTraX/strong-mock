/* eslint-disable class-methods-use-this */
import { expect } from 'tdd-buffet/expect/jest';
import { describe, it } from 'tdd-buffet/suite/node';
import { when } from '../src';
import { FIFORepository } from '../src/expectation-repository';
import { mock } from '../src/mock';
import { reset } from '../src/reset';

describe('reset', () => {
  it('should clear the expectation repo', () => {
    const repo = new FIFORepository();
    const fn = mock<() => void>(repo);

    when(fn()).thenReturn(undefined);
    reset(fn);

    expect(repo.getUnmet()).toHaveLength(0);
  });
});
