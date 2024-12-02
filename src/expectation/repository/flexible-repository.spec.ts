import { describe, expect, it } from 'vitest';
import { UnexpectedAccess } from '../../errors/unexpected-access';
import { UnexpectedCall } from '../../errors/unexpected-call';
import { UnexpectedProperty } from '../../mock/options';
import { ApplyProp } from '../expectation';
import {
  MatchingCallExpectation,
  MatchingPropertyExpectation,
  NotMatchingExpectation,
} from '../expectation.mocks';
import type { CallStats } from './expectation-repository';
import { FlexibleRepository } from './flexible-repository';

describe('FlexibleRepository', () => {
  describe('property expectations', () => {
    it('should match the first expectation', () => {
      const repo = new FlexibleRepository();
      repo.add(new MatchingPropertyExpectation('foo', { value: 23 }));

      expect(repo.get('foo')).toEqual(23);
    });

    it('should match the expectations in order', () => {
      const repo = new FlexibleRepository();
      repo.add(new MatchingPropertyExpectation('foo', { value: 23 }));
      repo.add(new MatchingPropertyExpectation('foo', { value: 42 }));

      expect(repo.get('foo')).toEqual(23);
      expect(repo.get('foo')).toEqual(42);
    });

    it('should keep matching an expectation until it is fulfilled', () => {
      const repo = new FlexibleRepository();
      const expectation = new MatchingPropertyExpectation('foo', {
        value: 23,
      });
      expectation.setInvocationCount(2, 3);
      repo.add(expectation);

      expect(repo.get('foo')).toEqual(23);
      expect(repo.get('foo')).toEqual(23);
      expect(repo.get('foo')).toEqual(23);
    });
  });

  describe('function expectations', () => {
    it('should match the first expectation', () => {
      const repo = new FlexibleRepository();
      repo.add(new MatchingCallExpectation('foo', { value: 23 }));

      expect(repo.get('foo')()).toEqual(23);
    });

    it('should match the expectations in order', () => {
      const repo = new FlexibleRepository();
      repo.add(new MatchingCallExpectation('foo', { value: 23 }));
      repo.add(new MatchingCallExpectation('foo', { value: 42 }));

      expect(repo.get('foo')()).toEqual(23);
      expect(repo.get('foo')()).toEqual(42);
    });

    it('should match property expectations before function expectations', () => {
      const repo = new FlexibleRepository();
      repo.add(new MatchingCallExpectation('foo', { value: 1 }));
      repo.add(
        new MatchingPropertyExpectation('foo', {
          value: () => ({ value: 2 }),
        }),
      );

      expect(repo.get('foo')()).toEqual({ value: 2 });
      expect(repo.get('foo')()).toEqual(1);
    });

    it('should keep matching an expectation until it is fulfilled', () => {
      const repo = new FlexibleRepository();
      const expectation = new MatchingCallExpectation('foo', { value: 23 });
      expectation.setInvocationCount(2, 3);
      repo.add(expectation);

      expect(repo.get('foo')()).toEqual(23);
      expect(repo.get('foo')()).toEqual(23);
      expect(repo.get('foo')()).toEqual(23);
    });

    it('should throw if the value is an error', () => {
      const repo = new FlexibleRepository();
      const expectation = new MatchingCallExpectation('foo', {
        value: new Error(),
        isError: true,
      });
      repo.add(expectation);

      expect(() => repo.get('foo')()).toThrow();
    });
  });

  describe('unmet expectations', () => {
    it('should not have any unmet expectations in the beginning', () => {
      const repo = new FlexibleRepository();
      expect(repo.getUnmet()).toEqual([]);
    });

    it('should mark all added expectations as unmet', () => {
      const repo = new FlexibleRepository();
      const e1 = new MatchingPropertyExpectation('foo', { value: 1 });
      const e2 = new MatchingPropertyExpectation('bar', { value: 1 });
      repo.add(e1);
      repo.add(e2);

      expect(repo.getUnmet()).toEqual([e1, e2]);
    });

    it('should mark an expectation as met when it is completely fulfilled', () => {
      const repo = new FlexibleRepository();
      const expectation = new MatchingPropertyExpectation('foo', {
        value: 23,
      });
      expectation.setInvocationCount(2, 3);
      repo.add(expectation);

      repo.get('foo');
      repo.get('foo');
      repo.get('foo');

      expect(repo.getUnmet()).toEqual([]);
    });

    it('should keep an expectation as unmet until it is completely fulfilled', () => {
      const repo = new FlexibleRepository();
      const expectation = new MatchingPropertyExpectation('foo', {
        value: 23,
      });
      expectation.setInvocationCount(2, 3);
      repo.add(expectation);

      repo.get('foo');
      expect(repo.getUnmet()).toEqual([expectation]);

      repo.get('foo');
      expect(repo.getUnmet()).toEqual([]);
    });
  });

  describe('call stats', () => {
    it('should start with empty call stats', () => {
      const repo = new FlexibleRepository();
      const callStats: CallStats = {
        expected: new Map(),
        unexpected: new Map(),
      };
      expect(repo.getCallStats()).toEqual(callStats);
    });

    it('it should record property accesses', () => {
      const repo = new FlexibleRepository();
      repo.add(new MatchingPropertyExpectation('foo', { value: 23 }));
      repo.add(new MatchingPropertyExpectation('foo', { value: 23 }));
      repo.add(new MatchingPropertyExpectation('bar', { value: 23 }));
      repo.add(new MatchingPropertyExpectation('bar', { value: 23 }));

      repo.get('foo');
      repo.get('foo');
      repo.get('bar');
      repo.get('bar');

      const callStats: CallStats = {
        expected: new Map([
          ['foo', [{ arguments: undefined }, { arguments: undefined }]],
          ['bar', [{ arguments: undefined }, { arguments: undefined }]],
        ]),
        unexpected: new Map(),
      };

      expect(repo.getCallStats()).toEqual(callStats);
    });

    it('it should record method calls', () => {
      const repo = new FlexibleRepository();
      const expectation = new MatchingCallExpectation('foo', { value: 23 });
      repo.add(expectation);

      repo.get('foo')(1, 2);

      const callStats: CallStats = {
        expected: new Map([
          ['foo', [{ arguments: undefined }, { arguments: [1, 2] }]],
        ]),
        unexpected: new Map(),
      };

      expect(repo.getCallStats()).toEqual(callStats);
    });

    it('it should record function calls', () => {
      const repo = new FlexibleRepository();
      const expectation = new MatchingCallExpectation(ApplyProp, { value: 23 });
      repo.add(expectation);

      repo.apply([1, 2]);

      const callStats: CallStats = {
        expected: new Map([[ApplyProp, [{ arguments: [1, 2] }]]]),
        unexpected: new Map(),
      };

      expect(repo.getCallStats()).toEqual(callStats);
    });
  });

  describe('clearing', () => {
    it('should remove all expectations when clearing', () => {
      const repo = new FlexibleRepository();
      repo.add(new MatchingPropertyExpectation('foo', { value: 23 }));

      repo.clear();

      expect(repo.getUnmet()).toEqual([]);
    });

    it('should clear all call stats', () => {
      const repo = new FlexibleRepository();
      repo.add(new MatchingPropertyExpectation('foo', { value: 23 }));

      repo.get('foo');

      try {
        repo.get('foo');
        // eslint-disable-next-line no-empty
      } catch (e) {}
      repo.clear();

      const callStats: CallStats = {
        expected: new Map(),
        unexpected: new Map(),
      };
      expect(repo.getCallStats()).toEqual(callStats);
    });
  });

  describe('stringify', () => {
    it('should return values for toString and friends', () => {
      const repo = new FlexibleRepository();
      expect(repo.get('toString')()).toBeTruthy();
      expect(repo.get('@@toStringTag')).toBeTruthy();
      expect(repo.get(Symbol.toStringTag)).toBeTruthy();
    });

    it('should match expectations for toString and friends', () => {
      const repo = new FlexibleRepository();
      repo.add(
        new MatchingPropertyExpectation('toString', {
          value: () => 'not a mock',
        }),
      );
      repo.add(
        new MatchingCallExpectation('toString', {
          value: 'I said not a mock',
        }),
      );
      repo.add(
        new MatchingPropertyExpectation('@@toStringTag', {
          value: 'totally not a mock',
        }),
      );
      repo.add(
        new MatchingPropertyExpectation(Symbol.toStringTag, {
          value: 'absolutely not a mock',
        }),
      );

      expect(repo.get('toString')()).toEqual('not a mock');
      expect(repo.get('toString')()).toEqual('I said not a mock');
      expect(repo.get('@@toStringTag')).toEqual('totally not a mock');
      expect(repo.get(Symbol.toStringTag)).toEqual('absolutely not a mock');
    });
  });

  describe('promise', () => {
    it('should not look like a thenable', () => {
      const repo = new FlexibleRepository();

      expect(repo.get('then')).toBeUndefined();
    });

    it('should match expectations for then', () => {
      const repo = new FlexibleRepository();
      repo.add(
        new MatchingPropertyExpectation('then', {
          value: 42,
        }),
      );

      expect(repo.get('then')).toEqual(42);
    });
  });

  describe('getAllProperties', () => {
    it('should return all the properties that have expectations', () => {
      const repo = new FlexibleRepository();
      repo.add(new MatchingPropertyExpectation('foo', { value: 23 }));
      repo.add(new MatchingPropertyExpectation('foo', { value: 23 }));
      repo.add(new MatchingPropertyExpectation('bar', { value: 23 }));

      expect(repo.getAllProperties()).toEqual(['foo', 'bar']);
    });
  });

  describe('default return value', () => {
    describe('THROW', () => {
      it('should throw if no property expectations match', () => {
        const repo = new FlexibleRepository();

        expect(() => repo.get('whatever')).toThrow(UnexpectedAccess);
      });

      it('should throw if no call expectations match', () => {
        const repo = new FlexibleRepository();

        repo.add(new NotMatchingExpectation('foo', { value: 23 }));

        expect(() => repo.get('foo')(3, 4)).toThrow(UnexpectedCall);
      });

      it('should throw if no apply expectations', () => {
        const repo = new FlexibleRepository();

        expect(() => repo.apply([1, 2, 3])).toThrow(UnexpectedCall);
      });

      it('should throw after a property expectation is fulfilled', () => {
        const repo = new FlexibleRepository();

        repo.add(new MatchingPropertyExpectation('foo', { value: 23 }));
        repo.get('foo');

        expect(() => repo.get('foo')).toThrow(UnexpectedAccess);
      });

      it('should throw after a function expectation is fulfilled', () => {
        const repo = new FlexibleRepository();

        repo.add(new MatchingCallExpectation('foo', { value: 23 }));
        repo.get('foo')(1, 2);

        expect(() => repo.get('foo')).toThrow(UnexpectedAccess);
      });

      it('should record calls for unexpected access', () => {
        const repo = new FlexibleRepository();

        try {
          repo.get('foo');
          // eslint-disable-next-line no-empty
        } catch (e) {}

        const callStats: CallStats = {
          expected: new Map(),
          unexpected: new Map([['foo', [{ arguments: undefined }]]]),
        };
        expect(repo.getCallStats()).toEqual(callStats);
      });

      it('should record calls for unexpected call', () => {
        const repo = new FlexibleRepository();
        repo.add(new NotMatchingExpectation('foo', { value: 23 }));

        try {
          repo.get('foo')(1, 2, 3);
          // eslint-disable-next-line no-empty
        } catch (e) {}

        const callStats: CallStats = {
          expected: new Map([['foo', [{ arguments: undefined }]]]),
          unexpected: new Map([['foo', [{ arguments: [1, 2, 3] }]]]),
        };
        expect(repo.getCallStats()).toEqual(callStats);
      });
    });

    describe('CALL_THROW', () => {
      it('should return the matching property expectation', () => {
        const repo = new FlexibleRepository(UnexpectedProperty.CALL_THROW);

        repo.add(new MatchingPropertyExpectation('foo', { value: 23 }));

        expect(repo.get('foo')).toEqual(23);
      });

      it('should return a function that throws unexpected call for properties with no expectations', () => {
        const repo = new FlexibleRepository(UnexpectedProperty.CALL_THROW);

        const value = repo.get('foo');

        expect(value).toBeInstanceOf(Function);
        expect(() => value(1, 2, 3)).toThrow(UnexpectedCall);
      });

      it('should first consume the matching property expectation and then return a throwing function', () => {
        const repo = new FlexibleRepository(UnexpectedProperty.CALL_THROW);

        repo.add(new MatchingPropertyExpectation('foo', { value: 23 }));

        expect(repo.get('foo')).toEqual(23);

        expect(repo.get('foo')).toBeInstanceOf(Function);
        expect(() => repo.get('foo')(1, 2, 3)).toThrow(UnexpectedCall);
      });

      it('should throw for an unexpected call', () => {
        const repo = new FlexibleRepository(UnexpectedProperty.CALL_THROW);
        repo.add({
          property: 'foo',
          args: [],
          returnValue: { value: true },
          min: 1,
          max: 1,
          matches: () => false,
          toString: () => 'bla',
          setInvocationCount() {},
        });

        const value = repo.get('foo');

        expect(value).toBeInstanceOf(Function);
        expect(() => value(1, 2, 3)).toThrow();
      });

      it('should throw for an unexpected call', () => {
        const repo = new FlexibleRepository(UnexpectedProperty.CALL_THROW);

        const value = repo.get(ApplyProp);

        expect(value).toBeInstanceOf(Function);
        expect(() => value(1, 2, 3)).toThrow();
      });

      it('should not record the unexpected property access', () => {
        const repo = new FlexibleRepository(UnexpectedProperty.CALL_THROW);

        repo.get('foo');

        expect(repo.getCallStats().unexpected.size).toEqual(0);
      });

      it('should record the unexpected call', () => {
        const repo = new FlexibleRepository(UnexpectedProperty.CALL_THROW);

        expect(() => repo.get('foo')(1, 2, 3)).toThrow();

        expect(repo.getCallStats().unexpected.get('foo')).toEqual([
          { arguments: [1, 2, 3] },
        ]);
      });
    });
  });

  it('should throw matching property error expectation', () => {
    const repo = new FlexibleRepository();
    repo.add(
      new MatchingPropertyExpectation('foo', { value: 'bar', isError: true }),
    );

    expect(() => repo.get('foo')).toThrow('bar');
  });

  it('should resolve matching property promise expectation', async () => {
    const repo = new FlexibleRepository();
    repo.add(
      new MatchingPropertyExpectation('foo', { value: 'bar', isPromise: true }),
    );

    expect(await repo.get('foo')).toEqual('bar');
  });

  it('should reject matching property error promise expectation', async () => {
    const repo = new FlexibleRepository();
    repo.add(
      new MatchingPropertyExpectation('foo', {
        value: 'bar',
        isPromise: true,
        isError: true,
      }),
    );

    await expect(() => repo.get('foo')).rejects.toThrow('bar');
  });
});
