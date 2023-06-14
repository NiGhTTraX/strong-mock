import { expectAnsilessContain, expectAnsilessEqual } from '../tests/ansiless';
import { SM } from '../tests/old';
import { UnexpectedAccess, UnexpectedCalls, UnmetExpectations } from './errors';
import type { Expectation } from './expectation/expectation';
import { spyExpectationFactory } from './expectation/expectation.mocks';
import type { CallMap } from './expectation/repository/expectation-repository';
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
});
