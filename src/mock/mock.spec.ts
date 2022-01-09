import { NotAMock } from '../errors';
import { getMockState } from './map';
import { mock } from './mock';
import { ExpectationRepository } from '../expectation/repository/expectation-repository';
import { SM } from '../../tests/old';

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
