import { expect } from 'tdd-buffet/expect/jest';
import { ExpectationRepository } from '../src/expectation-repository';
import {
  NeverEndingAlwaysMatchingExpectation,
  NeverMatchingExpectation,
  OneUseAlwaysMatchingExpectation,
} from './expectations';

export type RepoContractTest = {
  name: string;
  test: (repo: ExpectationRepository) => () => void;
};

export const repoContractTests: RepoContractTest[] = [
  {
    name: 'should return the first matching expectation with no args',
    test: (repository) => () => {
      const expectation1 = new NeverMatchingExpectation();
      const expectation2 = new OneUseAlwaysMatchingExpectation();
      const expectation3 = new OneUseAlwaysMatchingExpectation();

      repository.add(expectation1);
      repository.add(expectation2);
      repository.add(expectation3);

      expect(repository.get('bar', undefined)?.returnValue).toEqual(
        expectation2.returnValue
      );
    },
  },
  {
    name: 'should return that it has unmet expectations for property',
    test: (repository) => () => {
      repository.add(new OneUseAlwaysMatchingExpectation());

      expect(repository.hasKey('bar')).toBeTruthy();
    },
  },
  {
    name: 'should not return any unmet expectations when empty',
    test: (repository) => () => {
      expect(repository.getUnmet()).toHaveLength(0);
    },
  },
  {
    name: 'should return unmet expectations',
    test: (repository) => () => {
      const e1 = new NeverMatchingExpectation();
      const e2 = new NeverMatchingExpectation();
      repository.add(e1);
      repository.add(e2);

      expect(repository.getUnmet()).toEqual([e1, e2]);
    },
  },
  {
    name: 'should filter met expectations',
    test: (repository) => () => {
      const e1 = new NeverEndingAlwaysMatchingExpectation();
      const e2 = new NeverEndingAlwaysMatchingExpectation();
      repository.add(e1);
      repository.add(e2);

      expect(repository.getUnmet()).toEqual([]);
    },
  },
  {
    name: 'should keep matching an expectation',
    test: (repository) => () => {
      const expectation = new NeverEndingAlwaysMatchingExpectation();
      repository.add(expectation);

      expect(repository.get('bar', undefined)?.returnValue).toEqual(
        expectation.returnValue
      );
      expect(repository.get('bar', undefined)?.returnValue).toEqual(
        expectation.returnValue
      );
    },
  },
  {
    name: 'should have defaults for toString',
    test: (repository) => () => {
      expect(repository.hasKey('toString')).toBeTruthy();
      expect(repository.hasKey(Symbol.toStringTag)).toBeTruthy();
      expect(repository.hasKey('@@toStringTag')).toBeTruthy();

      expect(repository.get('toString', undefined)?.returnValue()).toEqual(
        'mock'
      );
      expect(
        repository.get(Symbol.toStringTag, undefined)?.returnValue
      ).toEqual('mock');
      expect(repository.get('@@toStringTag', undefined)?.returnValue).toEqual(
        'mock'
      );
    },
  },
];
