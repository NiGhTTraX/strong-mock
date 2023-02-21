import { expectAnsilessContain, expectAnsilessEqual } from '../tests/ansiless';
import { SM } from '../tests/old';
import {
  NestedWhen,
  UnexpectedAccess,
  UnexpectedCall,
  UnexpectedCalls,
  UnfinishedExpectation,
  UnmetExpectations,
} from './errors';
import type { Expectation } from './expectation/expectation';
import {
  spyExpectationFactory,
  SpyPendingExpectation,
} from './expectation/expectation.mocks';
import { It } from './expectation/it';
import type { CallMap } from './expectation/repository/expectation-repository';
import { StrongExpectation } from './expectation/strong-expectation';
import type { ConcreteMatcher } from './mock/options';
import { PendingExpectationWithFactory } from './when/pending-expectation';

describe('errors', () => {
  describe('PendingExpectation', () => {
    it('should print call', () => {
      const matcher = SM.mock<ConcreteMatcher>();
      const pendingExpectation = new PendingExpectationWithFactory(
        spyExpectationFactory,
        SM.instance(matcher),
        false
      );

      pendingExpectation.setArgs([1, 2, 3]);
      pendingExpectation.setProperty('bar');

      expectAnsilessEqual(
        pendingExpectation.toJSON(),
        `when(() => mock.bar(1, 2, 3))`
      );
    });

    it('should print property access', () => {
      const matcher = SM.mock<ConcreteMatcher>();
      const pendingExpectation = new PendingExpectationWithFactory(
        spyExpectationFactory,
        SM.instance(matcher),
        false
      );

      pendingExpectation.setArgs(undefined);
      pendingExpectation.setProperty('bar');

      expectAnsilessEqual(pendingExpectation.toJSON(), `when(() => mock.bar)`);
    });
  });

  describe('UnfinishedExpectation', () => {
    it('should print the pending expectation', () => {
      const pendingExpectation = new SpyPendingExpectation();
      pendingExpectation.setArgs([1, 2, 3]);
      pendingExpectation.setProperty('bar');
      pendingExpectation.toJSON = () => 'foobar';

      expectAnsilessContain(
        new UnfinishedExpectation(pendingExpectation).message,
        `There is an unfinished pending expectation:

foobar`
      );
    });
  });

  describe('UnmetExpectations', () => {
    it('should print all expectations', () => {
      const expectation1 = SM.mock<Expectation>();
      SM.when(expectation1.toJSON()).thenReturn('e1');
      const expectation2 = SM.mock<Expectation>();
      SM.when(expectation2.toJSON()).thenReturn('e2');

      const error = new UnmetExpectations([
        SM.instance(expectation1),
        SM.instance(expectation2),
      ]);

      expectAnsilessEqual(
        error.message,
        `There are unmet expectations:

 - e1
 - e2`
      );
    });
  });

  describe('UnexpectedAccess', () => {
    it('should print the property and the existing expectations', () => {
      const e1 = SM.mock<Expectation>();
      const e2 = SM.mock<Expectation>();
      SM.when(e1.toJSON()).thenReturn('e1');
      SM.when(e2.toJSON()).thenReturn('e2');

      const error = new UnexpectedAccess('bar', [
        SM.instance(e1),
        SM.instance(e2),
      ]);

      expectAnsilessContain(
        error.message,
        `Didn't expect mock.bar to be accessed.`
      );

      expectAnsilessContain(
        error.message,
        `Remaining unmet expectations:
 - e1
 - e2`
      );
    });
  });

  describe('UnexpectedCall', () => {
    it('should print the call', () => {
      const error = new UnexpectedCall('bar', [1, 2, 3], []);

      expectAnsilessContain(
        error.message,
        `Didn't expect mock.bar(1, 2, 3) to be called.`
      );
    });

    it('should print the diff', () => {
      const matcher = It.matches(() => false, {
        getDiff: (actual) => ({ actual, expected: 'foo' }),
      });

      const expectation = new StrongExpectation('bar', [matcher], {
        value: ':irrelevant:',
      });

      const error = new UnexpectedCall('bar', [1, 2, 3], [expectation]);

      expectAnsilessContain(error.message, `Expected`);
    });

    it('should print the diff only for expectations for the same property', () => {
      const matcher = It.matches(() => false, {
        getDiff: (actual) => ({ actual, expected: 'foo' }),
      });

      const e1 = new StrongExpectation('foo', [matcher], {
        value: ':irrelevant:',
      });
      const e2 = new StrongExpectation('bar', [matcher], {
        value: ':irrelevant:',
      });

      const error = new UnexpectedCall('foo', [1, 2, 3], [e1, e2]);

      // Yeah, funky way to do a negated ansiless contains.
      expect(() => expectAnsilessContain(error.message, `bar`)).toThrow();
    });

    it("should contain actual and expected values when there's a single expectation remaining", () => {
      const matcher = It.matches(() => false, {
        getDiff: () => ({ actual: 'actual', expected: 'expected' }),
      });

      const expectation = new StrongExpectation('foo', [matcher, matcher], {
        value: ':irrelevant:',
      });

      const error = new UnexpectedCall(
        'foo',
        ['any arg', 'any arg'],
        [expectation]
      );

      expect(error.matcherResult).toEqual({
        actual: ['actual', 'actual'],
        expected: ['expected', 'expected'],
      });
    });

    it('should not contain actual and expected values when the expectation has no expected args', () => {
      const expectation = new StrongExpectation('foo', [], {
        value: ':irrelevant:',
      });

      const error = new UnexpectedCall(
        'foo',
        ['any arg', 'any arg'],
        [expectation]
      );

      expect(error.matcherResult).toBeUndefined();
    });
  });

  describe('UnexpectedCalls', () => {
    it('should print the unexpected calls and remaining expectations', () => {
      const e1 = SM.mock<Expectation>();
      const e2 = SM.mock<Expectation>();
      SM.when(e1.toJSON()).thenReturn('e1');
      SM.when(e2.toJSON()).thenReturn('e2');

      const error = new UnexpectedCalls(
        new Map([
          [
            'foo',
            [
              { arguments: undefined },
              { arguments: [1, 2, 3] },
              { arguments: undefined },
              { arguments: [4, 5, 6] },
            ],
          ],
          ['bar', [{ arguments: undefined }]],
        ]) as CallMap,
        [SM.instance(e1), SM.instance(e2)]
      );

      expectAnsilessContain(
        error.message,
        `The following calls were unexpected:

 - mock.foo(1, 2, 3)
 - mock.foo(4, 5, 6)
 - mock.bar`
      );

      expectAnsilessContain(
        error.message,
        `Remaining unmet expectations:
 - e1
 - e2`
      );
    });
  });

  describe('NestedWhen', () => {
    it('should print the nested property', () => {
      const error = new NestedWhen('foo', Symbol('bar'));

      expectAnsilessContain(error.message, `when(() => parentMock.foo)`);
      expectAnsilessContain(
        error.message,
        `when(() => childMock[Symbol(bar)])`
      );
    });
  });
});
