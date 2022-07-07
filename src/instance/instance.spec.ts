import { printExpected } from 'jest-matcher-utils';
import { expectAnsilessEqual } from '../../tests/ansiless';
import { SM } from '../../tests/old';
import { ExpectationRepository } from '../expectation/repository/expectation-repository';
import { instance } from '../index';
import { mock } from '../mock/mock';

describe('instance', () => {
  const repo = SM.mock<ExpectationRepository>();

  it('should pretty print', () => {
    expectAnsilessEqual(
      printExpected(instance(mock<any>())),
      '[Function mock]'
    );
  });

  it('should be referentially stable', () => {
    const fn = mock<unknown>({ repository: SM.instance(repo) });

    const i1 = instance(fn);
    const i2 = instance(fn);

    expect(i1 === i2).toBeTruthy();
  });
});
