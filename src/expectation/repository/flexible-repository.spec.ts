import { UnexpectedAccess, UnexpectedCall } from '../../errors';
import { ApplyProp } from '../expectation';
import {
  MatchingCallExpectation,
  MatchingPropertyExpectation,
  NotMatchingExpectation,
} from '../expectation.mocks';
import { CallStats } from './expectation-repository';
import { FlexibleRepository, Strictness } from './flexible-repository';

describe('FlexibleRepository', () => {
  describe('property expectations', () => {
    it('should match the first expectation', () => {
      const repo = new FlexibleRepository();
      repo.add(new MatchingPropertyExpectation('foo', { value: 23 }));

      expect(repo.get('foo').value).toEqual(23);
    });

    it('should match the expectations in order', () => {
      const repo = new FlexibleRepository();
      repo.add(new MatchingPropertyExpectation('foo', { value: 23 }));
      repo.add(new MatchingPropertyExpectation('foo', { value: 42 }));

      expect(repo.get('foo').value).toEqual(23);
      expect(repo.get('foo').value).toEqual(42);
    });

    it('should keep matching an expectation until it is fulfilled', () => {
      const repo = new FlexibleRepository();
      const expectation = new MatchingPropertyExpectation('foo', {
        value: 23,
      });
      expectation.setInvocationCount(2, 3);
      repo.add(expectation);

      expect(repo.get('foo').value).toEqual(23);
      expect(repo.get('foo').value).toEqual(23);
      expect(repo.get('foo').value).toEqual(23);
    });
  });

  describe('function expectations', () => {
    it('should match the first expectation', () => {
      const repo = new FlexibleRepository();
      repo.add(new MatchingCallExpectation('foo', { value: 23 }));

      expect(repo.get('foo').value()).toEqual(23);
    });

    it('should match the expectations in order', () => {
      const repo = new FlexibleRepository();
      repo.add(new MatchingCallExpectation('foo', { value: 23 }));
      repo.add(new MatchingCallExpectation('foo', { value: 42 }));

      expect(repo.get('foo').value()).toEqual(23);
      expect(repo.get('foo').value()).toEqual(42);
    });

    it('should match property expectations before function expectations', () => {
      const repo = new FlexibleRepository();
      repo.add(new MatchingCallExpectation('foo', { value: 1 }));
      repo.add(
        new MatchingPropertyExpectation('foo', {
          value: () => ({ value: 2 }),
        })
      );

      expect(repo.get('foo').value()).toEqual({ value: 2 });
      expect(repo.get('foo').value()).toEqual(1);
    });

    it('should keep matching an expectation until it is fulfilled', () => {
      const repo = new FlexibleRepository();
      const expectation = new MatchingCallExpectation('foo', { value: 23 });
      expectation.setInvocationCount(2, 3);
      repo.add(expectation);

      expect(repo.get('foo').value()).toEqual(23);
      expect(repo.get('foo').value()).toEqual(23);
      expect(repo.get('foo').value()).toEqual(23);
    });

    it('should throw if the value is an error', () => {
      const repo = new FlexibleRepository();
      const expectation = new MatchingCallExpectation('foo', {
        value: new Error(),
        isError: true,
      });
      repo.add(expectation);

      expect(() => repo.get('foo').value()).toThrow();
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

    it('it should record function calls', () => {
      const repo = new FlexibleRepository();
      const expectation = new MatchingCallExpectation('foo', { value: 23 });
      repo.add(expectation);

      repo.get('foo').value(1, 2);

      const callStats: CallStats = {
        expected: new Map([
          ['foo', [{ arguments: undefined }, { arguments: [1, 2] }]],
        ]),
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
      expect(repo.get('toString').value()).toBeTruthy();
      expect(repo.get('@@toStringTag').value).toBeTruthy();
      expect(repo.get(Symbol.toStringTag).value).toBeTruthy();
    });

    it('should match expectations for toString and friends', () => {
      const repo = new FlexibleRepository();
      repo.add(
        new MatchingPropertyExpectation('toString', {
          value: () => 'not a mock',
        })
      );
      repo.add(
        new MatchingCallExpectation('toString', {
          value: 'I said not a mock',
        })
      );
      repo.add(
        new MatchingPropertyExpectation('@@toStringTag', {
          value: 'totally not a mock',
        })
      );
      repo.add(
        new MatchingPropertyExpectation(Symbol.toStringTag, {
          value: 'absolutely not a mock',
        })
      );

      expect(repo.get('toString').value()).toEqual('not a mock');
      expect(repo.get('toString').value()).toEqual('I said not a mock');
      expect(repo.get('@@toStringTag').value).toEqual('totally not a mock');
      expect(repo.get(Symbol.toStringTag).value).toEqual(
        'absolutely not a mock'
      );
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

  describe('super strict', () => {
    it('should throw if no property expectations match', () => {
      const repo = new FlexibleRepository();

      expect(() => repo.get('whatever')).toThrow(UnexpectedAccess);
    });

    it('should throw if no call expectations match', () => {
      const repo = new FlexibleRepository();

      repo.add(new NotMatchingExpectation('foo', { value: 23 }));

      expect(() => repo.get('foo').value(3, 4)).toThrow(UnexpectedCall);
    });

    it('should throw if no apply expectations', () => {
      const repo = new FlexibleRepository();

      expect(() => repo.get(ApplyProp).value(1, 2, 3)).toThrow(UnexpectedCall);
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
      repo.get('foo').value(1, 2);

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
        repo.get('foo').value(1, 2, 3);
        // eslint-disable-next-line no-empty
      } catch (e) {}

      const callStats: CallStats = {
        expected: new Map([['foo', [{ arguments: undefined }]]]),
        unexpected: new Map([['foo', [{ arguments: [1, 2, 3] }]]]),
      };
      expect(repo.getCallStats()).toEqual(callStats);
    });
  });

  describe('medium strict', () => {
    it('should return the matching property expectation', () => {
      const repo = new FlexibleRepository(Strictness.STRICT);

      repo.add(new MatchingPropertyExpectation('foo', { value: 23 }));

      expect(repo.get('foo').value).toEqual(23);
    });

    it('should return a function that throws unexpected call for properties with no expectations', () => {
      const repo = new FlexibleRepository(Strictness.STRICT);

      const { value } = repo.get('foo');

      expect(value).toBeInstanceOf(Function);
      expect(() => value(1, 2, 3)).toThrow(UnexpectedCall);
    });

    it('should not record the unexpected property access', () => {
      const repo = new FlexibleRepository(Strictness.STRICT);

      repo.get('foo');

      expect(repo.getCallStats().unexpected.size).toEqual(0);
    });

    it('should record the unexpected call', () => {
      const repo = new FlexibleRepository(Strictness.STRICT);

      expect(() => repo.get('foo').value(1, 2, 3)).toThrow();

      expect(repo.getCallStats().unexpected.get('foo')).toEqual([
        { arguments: [1, 2, 3] },
      ]);
    });
  });
});
