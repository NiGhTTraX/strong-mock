import { expectAnsilessEqual } from '../../tests/ansiless';
import { SM } from '../../tests/old';
import { spyExpectationFactory } from '../expectation/expectation.mocks';
import type { ConcreteMatcher } from '../mock/options';
import { PendingExpectationWithFactory } from './pending-expectation';

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
