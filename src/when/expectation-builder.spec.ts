import { SM } from '../../tests/old';
import { UnfinishedExpectation } from '../errors/api';
import { NotMatchingExpectation } from '../expectation/expectation.mocks';
import { matches } from '../matchers/matcher';
import type { ExpectationFactory } from './expectation-builder';
import { ExpectationBuilderWithFactory } from './expectation-builder';

describe('ExpectationBuilder', () => {
  const factory = SM.mock<ExpectationFactory>();
  const matcher = matches(() => false);
  const concreteMatcher = () => matcher;

  it('should finish the expectation', () => {
    const builder = new ExpectationBuilderWithFactory(
      SM.instance(factory),
      concreteMatcher,
      false
    );

    builder.setProperty('foo');
    builder.setArgs([1, 2, 3]);

    const expectation = new NotMatchingExpectation(':irrelevant:', {
      value: ':irrelevant:',
    });
    SM.when(
      factory('foo', [1, 2, 3], { value: 42 }, concreteMatcher, false)
    ).thenReturn(expectation);

    expect(builder.finish({ value: 42 })).toEqual(expectation);
  });

  it('should throw if unfinished', () => {
    const builder = new ExpectationBuilderWithFactory(
      SM.instance(factory),
      concreteMatcher,
      false
    );

    builder.setProperty('foo');

    expect(() => builder.setProperty('bar')).toThrow(UnfinishedExpectation);
  });
});
