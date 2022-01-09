import { ApplyProp } from '../expectation';
import { WeakRepository } from './weak-repository';
import {
  MatchingCallExpectation,
  MatchingPropertyExpectation,
} from '../expectation.mocks';
import { repoContractTests } from './repo.contract';

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

    expect(repo.get('whatever').value()).toEqual(null);
    expect(repo.get(ApplyProp).value()).toEqual(null);
  });

  it('should keep repeating the last met property expectation', () => {
    const repo = new WeakRepository();

    repo.add(new MatchingPropertyExpectation('foo', { value: 23 }));

    expect(repo.get('foo').value).toEqual(23);
    expect(repo.get('foo').value).toEqual(23);
  });

  it('should mark the last expectation as met', () => {
    const repo = new WeakRepository();

    repo.add(new MatchingPropertyExpectation('foo', { value: 23 }));
    expect(repo.get('foo').value).toEqual(23);

    expect(repo.getUnmet()).toEqual([]);
  });

  it('should add new property expectations after repeating the last', () => {
    const repo = new WeakRepository();

    repo.add(new MatchingPropertyExpectation('foo', { value: 23 }));
    expect(repo.get('foo').value).toEqual(23);
    repo.add(new MatchingPropertyExpectation('foo', { value: 42 }));

    expect(repo.get('foo').value).toEqual(42);
    expect(repo.get('foo').value).toEqual(42);
  });

  it('should keep repeating the last met call expectation', () => {
    const repo = new WeakRepository();

    repo.add(new MatchingCallExpectation('foo', { value: 23 }));

    expect(repo.get('foo').value(1, 2)).toEqual(23);
    expect(repo.get('foo').value(1, 2)).toEqual(23);
  });

  it('should add new call expectations after repeating the last', () => {
    const repo = new WeakRepository();

    repo.add(new MatchingCallExpectation('foo', { value: 23 }));
    expect(repo.get('foo').value(1, 2)).toEqual(23);
    repo.add(new MatchingCallExpectation('foo', { value: 42 }));

    expect(repo.get('foo').value(1, 2)).toEqual(42);
    expect(repo.get('foo').value(1, 2)).toEqual(42);
  });

  it('should keep repeating the last met call expectation', () => {
    const repo = new WeakRepository();

    repo.add(new MatchingCallExpectation('foo', { value: 23 }));
    expect(repo.get('foo').value(1, 2)).toEqual(23);

    expect(repo.getUnmet()).toEqual([]);
  });
});
