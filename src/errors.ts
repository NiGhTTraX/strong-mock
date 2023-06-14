import { EXPECTED_COLOR } from 'jest-matcher-utils';
import type { Expectation } from './expectation/expectation';
import { printProperty, printRemainingExpectations } from './print';
import type { Property } from './proxy';

export class UnexpectedAccess extends Error {
  constructor(property: Property, expectations: Expectation[]) {
    super(`Didn't expect ${EXPECTED_COLOR(
      `mock${printProperty(property)}`
    )} to be accessed.

If you expect this property to be accessed then please
set an expectation for it.

${printRemainingExpectations(expectations)}`);
  }
}
