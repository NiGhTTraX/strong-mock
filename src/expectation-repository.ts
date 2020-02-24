import isEqual from 'lodash/isEqual';
import { UnexpectedCall } from './errors';
import { Expectation } from './expectations';

export class ExpectationRepository {
  private repo: Expectation[] = [];

  addExpectation(expectation: Expectation) {
    this.repo.push(expectation);
  }

  // TODO: flip params
  getMatchingExpectation(
    args: any[] | undefined,
    property: string
  ): Expectation {
    const expectationIndex = this.repo.findIndex(
      e =>
        e.property === property &&
        args &&
        e.args.every((a, i) => isEqual(a, args[i]))
    );

    if (expectationIndex === -1) {
      throw new UnexpectedCall(property);
    }

    const expectation = this.repo[expectationIndex];
    this.repo.splice(expectationIndex, 1);
    return expectation;
  }
}
