import { expectAnsilessContain, expectAnsilessEqual } from '../tests/ansiless';
import { SM } from '../tests/old';
import { UnexpectedAccess } from './errors';
import type { Expectation } from './expectation/expectation';
import { spyExpectationFactory } from './expectation/expectation.mocks';
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
});
