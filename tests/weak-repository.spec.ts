import { expect } from 'tdd-buffet/expect/jest';
import { describe, it } from 'tdd-buffet/suite/node';
import { WeakRepository } from '../src/weak-repository';
import {
  MatchingCallExpectation,
  MatchingPropertyExpectation,
} from './expectations';
import { repoContractTests } from './repo-contract';

describe('WeakRepository', () => {
  Object.entries(repoContractTests).forEach(([suite, tests]) => {
    describe(suite, () => {
      tests.forEach(({ name, test }) => {
        it(name, test(new WeakRepository()));
      });
    });
  });

  it('should return a default value for everything', () => {
    const repo = new WeakRepository();

    expect(repo.get('whatever')()).toEqual(null);
  });

  it('should keep repeating the last met property expectation', () => {
    const repo = new WeakRepository();

    repo.add(new MatchingPropertyExpectation('foo', 23));

    expect(repo.get('foo')).toEqual(23);
    expect(repo.get('foo')).toEqual(23);
  });

  it('should mark the last expectation as met', () => {
    const repo = new WeakRepository();

    repo.add(new MatchingPropertyExpectation('foo', 23));
    expect(repo.get('foo')).toEqual(23);

    expect(repo.getUnmet()).toEqual([]);
  });

  it('should add new property expectations after repeating the last', () => {
    const repo = new WeakRepository();

    repo.add(new MatchingPropertyExpectation('foo', 23));
    expect(repo.get('foo')).toEqual(23);
    repo.add(new MatchingPropertyExpectation('foo', 42));

    expect(repo.get('foo')).toEqual(42);
    expect(repo.get('foo')).toEqual(42);
  });

  it('should keep repeating the last met call expectation', () => {
    const repo = new WeakRepository();

    repo.add(new MatchingCallExpectation('foo', 23));

    expect(repo.get('foo')(1, 2)).toEqual(23);
    expect(repo.get('foo')(1, 2)).toEqual(23);
  });

  it('should add new call expectations after repeating the last', () => {
    const repo = new WeakRepository();

    repo.add(new MatchingCallExpectation('foo', 23));
    expect(repo.get('foo')(1, 2)).toEqual(23);
    repo.add(new MatchingCallExpectation('foo', 42));

    expect(repo.get('foo')(1, 2)).toEqual(42);
    expect(repo.get('foo')(1, 2)).toEqual(42);
  });

  it('should keep repeating the last met call expectation', () => {
    const repo = new WeakRepository();

    repo.add(new MatchingCallExpectation('foo', 23));
    expect(repo.get('foo')(1, 2)).toEqual(23);

    expect(repo.getUnmet()).toEqual([]);
  });
});
