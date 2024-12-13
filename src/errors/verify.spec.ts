import { describe, it } from 'vitest';
import {
  expectAnsilessContain,
  expectAnsilessEqual,
} from '../../tests/ansiless.js';
import { SM } from '../../tests/old.js';
import type { Expectation } from '../expectation/expectation.js';
import type { CallMap } from '../expectation/repository/expectation-repository.js';
import { UnexpectedCalls, UnmetExpectations } from './verify.js';

describe('verify errors', () => {
  describe('UnmetExpectations', () => {
    it('should print all expectations', () => {
      const expectation1 = SM.mock<Expectation>();
      SM.when(() => expectation1.toString()).thenReturn('e1');

      const expectation2 = SM.mock<Expectation>();
      SM.when(() => expectation2.toString()).thenReturn('e2');

      const error = new UnmetExpectations([expectation1, expectation2]);

      expectAnsilessEqual(
        error.message,
        `There are unmet expectations:

 - e1
 - e2`,
      );
    });
  });

  describe('UnexpectedCalls', () => {
    it('should print the unexpected calls and remaining expectations', () => {
      const e1 = SM.mock<Expectation>();
      const e2 = SM.mock<Expectation>();
      SM.when(() => e1.toString()).thenReturn('e1');
      SM.when(() => e2.toString()).thenReturn('e2');

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
        [e1, e2],
      );

      expectAnsilessContain(
        error.message,
        `The following calls were unexpected:

 - mock.foo(1, 2, 3)
 - mock.foo(4, 5, 6)
 - mock.bar`,
      );

      expectAnsilessContain(
        error.message,
        `Remaining unmet expectations:
 - e1
 - e2`,
      );
    });
  });
});
