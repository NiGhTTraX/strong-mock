import { expect } from 'tdd-buffet/expect/jest';
import { describe, it } from 'tdd-buffet/suite/node';
import { NotAMock } from '../src/errors';
import { getRepoForStub, strongMock } from '../src/mock';
import { EmptyRepository } from './expectation-repository';

describe('mock', () => {
  it('should set repo on mock', () => {
    const repository = new EmptyRepository();

    const mock = strongMock(repository);

    expect(getRepoForStub(mock)).toEqual(repository);
  });

  it('should throw for missing repo', () => {
    expect(() => getRepoForStub({})).toThrow(NotAMock);
  });
});
