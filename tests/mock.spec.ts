import { expect } from 'tdd-buffet/expect/jest';
import { describe, it } from 'tdd-buffet/suite/node';
import { NotAMock } from '../src/errors';
import { getMockState } from '../src/mock/map';
import { mock } from '../src/mock/mock';
import { ExpectationRepository } from '../src/repository/expectation-repository';
import { SM } from './old';

describe('mock', () => {
  const repository = SM.mock<ExpectationRepository>();

  it('should set repo on mock', () => {
    const repo = SM.instance(repository);

    expect(getMockState(mock({ repository: repo })).repository).toBe(repo);
  });

  it('should throw for missing repo', () => {
    expect(() => getMockState({})).toThrow(NotAMock);
  });
});
