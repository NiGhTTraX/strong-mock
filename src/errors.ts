// TODO: improve all error messages
import { Expectation } from './expectation';
import { PendingExpectation } from './pending-expectation';

export class UnfinishedExpectation extends Error {
  constructor(pendingExpectation: PendingExpectation) {
    super(`There is an unfinished pending expectation:

${pendingExpectation.toString()}

Please finish it by chaining the expectation with a returns call.`);
  }
}

export class MissingWhen extends Error {
  constructor() {
    super(`You didn't set an expectation first`);
  }
}

export class UnexpectedCall extends Error {
  constructor(property: PropertyKey) {
    super(`Didn't expect method ${property.toString()} to be called`);
  }
}

export class NotAMock extends Error {
  constructor() {
    super(`This is not a mock`);
  }
}

export class UnmetExpectation extends Error {
  constructor(expectations: Expectation[]) {
    super(`There are unmet expectations:

 - ${expectations.map(e => e.toString()).join('\n - ')}`);
  }
}
