/* eslint-disable no-empty */
import { expect } from 'tdd-buffet/expect/jest';
import {
  CallStats,
  ExpectationRepository,
  ExpectationRepository2,
} from '../src/expectation-repository';
import {
  MatchingCallExpectation,
  MatchingPropertyExpectation,
  NeverEndingAlwaysMatchingExpectation,
  NeverMatchingExpectation,
  NotMatchingExpectation,
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

export type ExpectationRepositoryContract = {
  [suite: string]: ExpectationRepositoryTest[];
};

export type ExpectationRepositoryTest = {
  name: string;
  test: (repo: ExpectationRepository2) => () => void;
};

export const repoContractTests2: ExpectationRepositoryContract = {
  'property expectations': [
    {
      name: 'should match the first expectation',
      test: (repo) => () => {
        repo.add(new MatchingPropertyExpectation('foo', 23));

        expect(repo.get('foo')).toEqual(23);
      },
    },
    {
      name: 'should match the expectations in order',
      test: (repo) => () => {
        repo.add(new MatchingPropertyExpectation('foo', 23));
        repo.add(new MatchingPropertyExpectation('foo', 42));

        expect(repo.get('foo')).toEqual(23);
        expect(repo.get('foo')).toEqual(42);
      },
    },
    {
      name: 'should keep matching an expectation until it is fulfilled',
      test: (repo) => () => {
        const expectation = new MatchingPropertyExpectation('foo', 23);
        expectation.setInvocationCount(2, 3);
        repo.add(expectation);

        expect(repo.get('foo')).toEqual(23);
        expect(repo.get('foo')).toEqual(23);
        expect(repo.get('foo')).toEqual(23);
      },
    },
  ],

  'function expectations': [
    {
      name: 'should match the first expectation',
      test: (repo) => () => {
        repo.add(new MatchingCallExpectation('foo', 23));

        expect(repo.get('foo')()).toEqual(23);
      },
    },
    {
      name: 'should match the expectations in order',
      test: (repo) => () => {
        repo.add(new MatchingCallExpectation('foo', 23));
        repo.add(new MatchingCallExpectation('foo', 42));

        expect(repo.get('foo')()).toEqual(23);
        expect(repo.get('foo')()).toEqual(42);
      },
    },
    {
      name: 'should match property expectations before function expectations',
      test: (repo) => () => {
        repo.add(new MatchingCallExpectation('foo', 1));
        repo.add(new MatchingPropertyExpectation('foo', () => 2));

        expect(repo.get('foo')()).toEqual(2);
        expect(repo.get('foo')()).toEqual(1);
      },
    },
    {
      name: 'should keep matching an expectation until it is fulfilled',
      test: (repo) => () => {
        const expectation = new MatchingCallExpectation('foo', 23);
        expectation.setInvocationCount(2, 3);
        repo.add(expectation);

        expect(repo.get('foo')()).toEqual(23);
        expect(repo.get('foo')()).toEqual(23);
        expect(repo.get('foo')()).toEqual(23);
      },
    },
  ],

  'unmet expectations': [
    {
      name: 'should not have any unmet expectations in the beginning',
      test: (repo) => () => {
        expect(repo.getUnmet()).toEqual([]);
      },
    },
    {
      name: 'should mark all added expectations as unmet',
      test: (repo) => () => {
        const e1 = new MatchingPropertyExpectation('foo', 1);
        const e2 = new MatchingPropertyExpectation('bar', 1);
        repo.add(e1);
        repo.add(e2);

        expect(repo.getUnmet()).toEqual([e1, e2]);
      },
    },
    {
      name: 'should mark an expectation as met when it is completely fulfilled',
      test: (repo) => () => {
        const expectation = new MatchingPropertyExpectation('foo', 23);
        expectation.setInvocationCount(2, 3);
        repo.add(expectation);

        repo.get('foo');
        repo.get('foo');
        repo.get('foo');

        expect(repo.getUnmet()).toEqual([]);
      },
    },
    {
      name:
        'should keep an expectation as unmet until it is completely fulfilled',
      test: (repo) => () => {
        const expectation = new MatchingPropertyExpectation('foo', 23);
        expectation.setInvocationCount(2, 3);
        repo.add(expectation);

        repo.get('foo');
        expect(repo.getUnmet()).toEqual([expectation]);

        repo.get('foo');
        expect(repo.getUnmet()).toEqual([]);
      },
    },
  ],

  'call stats': [
    {
      name: 'should start with empty call stats',
      test: (repo) => () => {
        expect(repo.getCallStats()).toEqual(new Map());
      },
    },
    {
      name: 'it should record property accesses',
      test: (repo) => () => {
        repo.add(new MatchingPropertyExpectation('foo', 23));
        repo.add(new MatchingPropertyExpectation('foo', 23));
        repo.add(new MatchingPropertyExpectation('bar', 23));
        repo.add(new MatchingPropertyExpectation('bar', 23));

        repo.get('foo');
        repo.get('foo');
        repo.get('bar');
        repo.get('bar');

        const callStats: CallStats = new Map([
          ['foo', [{ arguments: undefined }, { arguments: undefined }]],
          ['bar', [{ arguments: undefined }, { arguments: undefined }]],
        ]);

        expect(repo.getCallStats()).toEqual(callStats);
      },
    },
    {
      name: 'it should record function calls',
      test: (repo) => () => {
        const expectation = new MatchingCallExpectation('foo', 23);
        repo.add(expectation);

        repo.get('foo')(1, 2);

        const callStats: CallStats = new Map([
          ['foo', [{ arguments: undefined }, { arguments: [1, 2] }]],
        ]);

        expect(repo.getCallStats()).toEqual(callStats);
      },
    },
    {
      name: 'should record calls for unexpected access',
      test: (repo) => () => {
        try {
          repo.get('foo');
        } catch (e) {}

        const callStats: CallStats = new Map([
          ['foo', [{ arguments: undefined }]],
        ]);
        expect(repo.getCallStats()).toEqual(callStats);
      },
    },
    {
      name: 'should record calls for unexpected call',
      test: (repo) => () => {
        repo.add(new NotMatchingExpectation('foo', 23));

        try {
          repo.get('foo')(1, 2, 3);
        } catch (e) {}

        const callStats: CallStats = new Map([
          ['foo', [{ arguments: undefined }, { arguments: [1, 2, 3] }]],
        ]);
        expect(repo.getCallStats()).toEqual(callStats);
      },
    },
  ],

  clearing: [
    {
      name: 'should remove all expectations when clearing',
      test: (repo) => () => {
        repo.add(new MatchingPropertyExpectation('foo', 23));

        repo.clear();

        expect(repo.getUnmet()).toEqual([]);
      },
    },
    {
      name: 'should clear all call stats',
      test: (repo) => () => {
        repo.add(new MatchingPropertyExpectation('foo', 23));

        repo.get('foo');
        repo.clear();

        expect(repo.getCallStats()).toEqual(new Map());
      },
    },
  ],

  stringify: [
    {
      name: 'should return values for toString and friends',
      test: (repo) => () => {
        expect(repo.get('toString')()).not.toHaveLength(0);
        expect(repo.get('@@toStringTag')).not.toHaveLength(0);
        expect(repo.get(Symbol.toStringTag)).not.toHaveLength(0);
      },
    },
    {
      name: 'should match expectations for toString and friends',
      test: (repo) => () => {
        repo.add(
          new MatchingPropertyExpectation('toString', () => 'not a mock')
        );
        repo.add(new MatchingCallExpectation('toString', 'I said not a mock'));
        repo.add(
          new MatchingPropertyExpectation('@@toStringTag', 'totally not a mock')
        );
        repo.add(
          new MatchingPropertyExpectation(
            Symbol.toStringTag,
            'absolutely not a mock'
          )
        );

        expect(repo.get('toString')()).toEqual('not a mock');
        expect(repo.get('toString')()).toEqual('I said not a mock');
        expect(repo.get('@@toStringTag')).toEqual('totally not a mock');
        expect(repo.get(Symbol.toStringTag)).toEqual('absolutely not a mock');
      },
    },
  ],
};
