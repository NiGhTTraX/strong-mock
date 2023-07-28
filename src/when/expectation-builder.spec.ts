import { expectAnsilessEqual } from '../../tests/ansiless';
import { SM } from '../../tests/old';
import { spyExpectationFactory } from '../expectation/expectation.mocks';
import type { ConcreteMatcher } from '../mock/options';
import { ExpectationBuilderWithFactory } from './expectation-builder';

describe('ExpectationBuilder', () => {
  it('should print call', () => {
    const matcher = SM.mock<ConcreteMatcher>();
    const builder = new ExpectationBuilderWithFactory(
      spyExpectationFactory,
      SM.instance(matcher),
      false
    );

    builder.setArgs([1, 2, 3]);
    builder.setProperty('bar');

    expectAnsilessEqual(builder.toString(), `when(() => mock.bar(1, 2, 3))`);
  });

  it('should print property access', () => {
    const matcher = SM.mock<ConcreteMatcher>();
    const builder = new ExpectationBuilderWithFactory(
      spyExpectationFactory,
      SM.instance(matcher),
      false
    );

    builder.setArgs(undefined);
    builder.setProperty('bar');

    expectAnsilessEqual(builder.toString(), `when(() => mock.bar)`);
  });
});
