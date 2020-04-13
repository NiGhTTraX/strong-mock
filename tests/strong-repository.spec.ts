import { expect } from 'tdd-buffet/expect/jest';
import { describe, it } from 'tdd-buffet/suite/node';
import { UnexpectedAccess, UnexpectedCall } from '../src/errors';
import { StrongRepository, StrongRepository2 } from '../src/strong-repository';
import {
  MatchingCallExpectation,
  MatchingPropertyExpectation,
  NotMatchingExpectation,
} from './expectations';
import { repoContractTests, repoContractTests2 } from './repo-contract';

describe('StrongRepository', () => {
  repoContractTests.forEach(({ name, test }) => {
    it(name, test(new StrongRepository()));
  });

  it("should return that it doesn't have any unmet expectations for property", () => {
    const repository = new StrongRepository();

    expect(repository.hasKey('bar')).toBeFalsy();
  });

  it('should not return anything if no matching expectations', () => {
    const repository = new StrongRepository();

    expect(repository.get('bar', [])).toBeUndefined();
  });
});

describe('StrongRepository2', () => {
  Object.entries(repoContractTests2).forEach(([suite, tests]) => {
    describe(suite, () => {
      tests.forEach(({ name, test }) => {
        it(name, test(new StrongRepository2()));
      });
    });
  });

  it('should throw if no property expectations match', () => {
    const repo = new StrongRepository2();

    expect(() => repo.get('whatever')).toThrow(UnexpectedAccess);
  });

  it('should throw if no call expectations match', () => {
    const repo = new StrongRepository2();
    repo.add(new NotMatchingExpectation('foo', 23));

    expect(() => repo.get('foo')(3, 4)).toThrow(UnexpectedCall);
  });

  it('should throw after a property expectation is fulfilled', () => {
    const repo = new StrongRepository2();
    repo.add(new MatchingPropertyExpectation('foo', 23));
    repo.get('foo');

    expect(() => repo.get('foo')).toThrow(UnexpectedAccess);
  });

  it('should throw after a function expectation is fulfilled', () => {
    const repo = new StrongRepository2();
    repo.add(new MatchingCallExpectation('foo', 23));
    repo.get('foo')(1, 2);

    expect(() => repo.get('foo')).toThrow(UnexpectedAccess);
  });
});
