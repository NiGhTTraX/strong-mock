import { DIM_COLOR } from 'jest-matcher-utils';
import type { Expectation } from '../expectation/expectation.js';
import { printCall, printRemainingExpectations } from '../print.js';
import type { Property } from '../proxy.js';

export class UnexpectedAccess extends Error {
  constructor(property: Property, expectations: Expectation[]) {
    super(
      DIM_COLOR(`Didn't expect ${printCall(property)} to be accessed.

If you expect this property to be accessed then please
set an expectation for it.

${printRemainingExpectations(expectations)}`),
    );
  }
}
