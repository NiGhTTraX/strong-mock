import { expect } from 'tdd-buffet/expect/jest';
import { describe, it } from 'tdd-buffet/suite/node';
import { NotAMock } from '../src/errors';
import { getMockState } from '../src/map';
import { mock } from '../src/mock';
import { EmptyRepository } from './expectation-repository';

describe('mock', () => {
  it('should set repo on mock', () => {
    const repository = new EmptyRepository();

    expect(getMockState(mock(repository)).repository).toEqual(repository);
  });

  it('should throw for missing repo', () => {
    expect(() => getMockState({})).toThrow(NotAMock);
  });
});
