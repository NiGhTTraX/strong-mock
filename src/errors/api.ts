import { printProperty } from '../print';
import type { Property } from '../proxy';
import type { PendingExpectation } from '../when/pending-expectation';

export class UnfinishedExpectation extends Error {
  constructor(pendingExpectation: PendingExpectation) {
    super(`There is an unfinished pending expectation:

${pendingExpectation.toJSON()}

Please finish it by setting a return value even if the value
is undefined.`);
  }
}

export class MissingWhen extends Error {
  constructor() {
    super(`You tried setting a return value without an expectation.

Every call to set a return value must be preceded by an expectation.`);
  }
}

export class NotAMock extends Error {
  constructor() {
    super(`We couldn't find the mock.

Make sure you're passing in an actual mock.`);
  }
}

export class NestedWhen extends Error {
  constructor(parentProp: Property, childProp: Property) {
    const snippet = `
const parentMock = mock<T1>();
const childMock = mock<T2>();

when(() => childMock${printProperty(childProp)}).thenReturn(...);
when(() => parentMock${printProperty(parentProp)}).thenReturn(childMock)
`;

    super(
      `Setting an expectation on a nested property is not supported.

You can return an object directly when the first property is accessed,
or you can even return a separate mock:
${snippet}`
    );
  }
}
