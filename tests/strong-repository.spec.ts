import { expect } from 'tdd-buffet/expect/jest';
import { describe, it } from 'tdd-buffet/suite/node';
import { StrongRepository } from '../src/strong-repository';
import {
  NeverEndingAlwaysMatchingExpectation,
  NeverMatchingExpectation,
  OneUseAlwaysMatchingExpectation
} from './expectations';

describe('StrongRepository', () => {
  it('should return the first matching expectation with no args', () => {
    const repository = new StrongRepository();

    const expectation1 = new NeverMatchingExpectation();
    const expectation2 = new OneUseAlwaysMatchingExpectation();
    const expectation3 = new OneUseAlwaysMatchingExpectation();

    repository.add(expectation1);
    repository.add(expectation2);
    repository.add(expectation3);

    expect(repository.get('bar', undefined)).toEqual(expectation2);
  });

  it('should return that it has unmet expectations for property', () => {
    const repository = new StrongRepository();

    repository.add(new OneUseAlwaysMatchingExpectation());

    expect(repository.hasKey('bar')).toBeTruthy();
  });

  it("should return that it doesn't have any unmet expectations for property", () => {
    const repository = new StrongRepository();

    expect(repository.hasKey('bar')).toBeFalsy();
  });

  it('should not return any unmet expectations when empty', () => {
    const repository = new StrongRepository();

    expect(repository.getUnmet()).toHaveLength(0);
  });

  it('should not return anything if no matching expectations', () => {
    const repository = new StrongRepository();

    expect(repository.get('bar', [])).toBeUndefined();
  });

  it('should return unmet expectations', () => {
    const repository = new StrongRepository();

    const e1 = new NeverMatchingExpectation();
    const e2 = new NeverMatchingExpectation();
    repository.add(e1);
    repository.add(e2);

    expect(repository.getUnmet()).toEqual([e1, e2]);
  });

  it('should filter met expectations', () => {
    const repository = new StrongRepository();

    const e1 = new NeverEndingAlwaysMatchingExpectation();
    const e2 = new NeverEndingAlwaysMatchingExpectation();
    repository.add(e1);
    repository.add(e2);

    expect(repository.getUnmet()).toEqual([]);
  });

  it('should not return any unmet expectations when min has been satisfied', () => {
    const repository = new StrongRepository();

    const expectation = new NeverEndingAlwaysMatchingExpectation();

    repository.add(expectation);

    expect(repository.getUnmet()).toHaveLength(0);
  });

  it('should keep matching an expectation', () => {
    const repository = new StrongRepository();

    const expectation = new NeverEndingAlwaysMatchingExpectation();
    repository.add(expectation);

    expect(repository.get('bar', undefined)).toEqual(expectation);
    expect(repository.get('bar', undefined)).toEqual(expectation);
  });

  it('should have defaults for toString', () => {
    const repository = new StrongRepository();

    expect(repository.hasKey('toString')).toBeTruthy();
    expect(repository.hasKey(Symbol.toStringTag)).toBeTruthy();
    expect(repository.hasKey('@@toStringTag')).toBeTruthy();

    expect(repository.get('toString', undefined)?.returnValue()).toEqual(
      'mock'
    );
    expect(repository.get(Symbol.toStringTag, undefined)?.returnValue).toEqual(
      'mock'
    );
    expect(repository.get('@@toStringTag', undefined)?.returnValue).toEqual(
      'mock'
    );
  });
});
