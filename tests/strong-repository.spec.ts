import { expect } from 'tdd-buffet/expect/jest';
import { describe, it } from 'tdd-buffet/suite/node';
import { StrongRepository } from '../src/strong-repository';
import { repoContractTests } from './repo-contract';

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
