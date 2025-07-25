import { describe, it } from 'vitest';
import { expectAnsilessContain } from '../../tests/ansiless.js';
import { SM } from '../../tests/old.js';
import type { Expectation } from '../expectation/expectation.js';
import { UnexpectedAccess } from './unexpected-access.js';

describe('UnexpectedAccess', () => {
  it('should print the property and the existing expectations', () => {
    const e1 = SM.mock<Expectation>();
    const e2 = SM.mock<Expectation>();
    SM.when(() => e1.toString()).thenReturn('e1');
    SM.when(() => e2.toString()).thenReturn('e2');

    const error = new UnexpectedAccess('bar', [e1, e2]);

    expectAnsilessContain(
      error.message,
      `Didn't expect mock.bar to be accessed.`,
    );

    expectAnsilessContain(
      error.message,
      `Remaining unmet expectations:
 - e1
 - e2`,
    );
  });
});
