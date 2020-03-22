import { Expectation } from './expectation';
import { ExpectationRepository } from './expectation-repository';
import { StrongExpectation } from './strong-expectation';

const toStringKeys: PropertyKey[] = [
  'toString',
  Symbol.toStringTag,
  '@@toStringTag'
];

/**
 * - Expectations will be returned in the order they were added.
 * - If there are no matching expectations for 'toString' then a default will be returned.
 * - If there are no matching expectations `undefined` will be returned.
 */
export class StrongRepository implements ExpectationRepository {
  private repo: Expectation[] = [];

  add(expectation: Expectation) {
    this.repo.push(expectation);
  }

  /**
   * @returns If nothing matches will return `undefined`.
   */
  find(property: PropertyKey, args: any[] | undefined) {
    const expectation = this.repo.find(e => e.matches(property, args));

    if (expectation) {
      return expectation;
    }

    switch (property) {
      case 'toString':
        return new StrongExpectation(property, undefined, () => 'mock');
      case Symbol.toStringTag:
      case '@@toStringTag':
        return new StrongExpectation(property, undefined, 'mock');
      default:
        return undefined;
    }
  }

  hasFor(property: PropertyKey) {
    return (
      !!this.repo.find(e => e.property === property) ||
      toStringKeys.includes(property)
    );
  }

  getUnmet() {
    return this.repo.filter(e => e.isUnmet());
  }

  clear(): void {
    this.repo = [];
  }
}
