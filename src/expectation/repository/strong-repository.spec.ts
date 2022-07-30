import { UnexpectedAccess, UnexpectedCall } from '../../errors';
import { ApplyProp } from '../expectation';
import {
  MatchingCallExpectation,
  MatchingPropertyExpectation,
  NotMatchingExpectation,
} from '../expectation.mocks';
import { repoContractTests } from './repo.contract';
import { Strictness, StrongRepository } from './strong-repository';

describe('StrongRepository', () => {
  Object.entries(repoContractTests).forEach(([suite, tests]) => {
    describe(suite, () => {
      tests.forEach(({ name, test }) => {
        it(name, test(new StrongRepository()));
      });
    });
  });

  describe('super strict', () => {
    it('should throw if no property expectations match', () => {
      const repo = new StrongRepository();

      expect(() => repo.get('whatever')).toThrow(UnexpectedAccess);
    });

    it('should throw if no call expectations match', () => {
      const repo = new StrongRepository();
      repo.add(new NotMatchingExpectation('foo', { value: 23 }));

      expect(() => repo.get('foo').value(3, 4)).toThrow(UnexpectedCall);
    });

    it('should throw if no apply expectations', () => {
      const repo = new StrongRepository();

      expect(() => repo.get(ApplyProp).value(1, 2, 3)).toThrow(UnexpectedCall);
    });

    it('should throw after a property expectation is fulfilled', () => {
      const repo = new StrongRepository();
      repo.add(new MatchingPropertyExpectation('foo', { value: 23 }));
      repo.get('foo');

      expect(() => repo.get('foo')).toThrow(UnexpectedAccess);
    });

    it('should throw after a function expectation is fulfilled', () => {
      const repo = new StrongRepository();
      repo.add(new MatchingCallExpectation('foo', { value: 23 }));
      repo.get('foo').value(1, 2);

      expect(() => repo.get('foo')).toThrow(UnexpectedAccess);
    });
  });

  describe('medium strict', () => {
    it('should return the matching property expectation', () => {
      const repo = new StrongRepository(Strictness.STRICT);

      repo.add(new MatchingPropertyExpectation('foo', { value: 23 }));

      expect(repo.get('foo').value).toEqual(23);
    });

    it('should return a function that throws unexpected call for properties with no expectations', () => {
      const repo = new StrongRepository(Strictness.STRICT);

      const { value } = repo.get('foo');

      expect(value).toBeInstanceOf(Function);
      expect(() => value(1, 2, 3)).toThrow(UnexpectedCall);
    });
  });
});
