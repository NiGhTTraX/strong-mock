import { Expectation } from './expectation';
import { ExpectationRepository, ReturnValue } from './expectation-repository';

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
  private expectations: Expectation[] = [];

  add(expectation: Expectation) {
    this.expectations.push(expectation);
  }

  /**
   * @returns If nothing matches will return `undefined`.
   */
  get(property: PropertyKey, args: any[] | undefined): ReturnValue | undefined {
    const expectation = this.expectations.find(e => e.matches(property, args));

    if (expectation) {
      return { returnValue: expectation.returnValue };
    }

    switch (property) {
      case 'toString':
        return { returnValue: () => 'mock' };
      case Symbol.toStringTag:
      case '@@toStringTag':
        return { returnValue: 'mock' };
      default:
        return undefined;
    }
  }

  hasKey(property: PropertyKey) {
    return (
      !!this.expectations.find(e => e.property === property) ||
      toStringKeys.includes(property)
    );
  }

  getUnmet() {
    return this.expectations.filter(e => e.isUnmet());
  }

  clear(): void {
    this.expectations = [];
  }
}
