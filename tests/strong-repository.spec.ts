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

    expect(repository.findAndConsume('bar', undefined)).toEqual(expectation2);
  });

  it('should completely consume an expectation', () => {
    const repository = new StrongRepository();

    const expectation = new OneUseAlwaysMatchingExpectation();

    repository.add(expectation);

    expect(repository.findAndConsume('bar', undefined)).toEqual(expectation);
    expect(repository.findAndConsume('bar', undefined)).toEqual(undefined);
    expect(repository.getUnmet()).toHaveLength(0);
  });

  it('should not return any unmet expectations when empty', () => {
    const repository = new StrongRepository();

    expect(repository.findAndConsume('bar', undefined)).toEqual(undefined);
    expect(repository.getUnmet()).toHaveLength(0);
  });

  it('should not return any unmet expectations when min has been satisfied', () => {
    const repository = new StrongRepository();

    const expectation = new NeverEndingAlwaysMatchingExpectation();

    repository.add(expectation);

    expect(repository.getUnmet()).toHaveLength(0);
  });

  it('should keep consuming an expectation', () => {
    const repository = new StrongRepository();

    const expectation = new NeverEndingAlwaysMatchingExpectation();
    repository.add(expectation);

    expect(repository.findAndConsume('bar', undefined)).toEqual(expectation);
    expect(repository.findAndConsume('bar', undefined)).toEqual(expectation);
  });

  it('should have defaults for toString', () => {
    const repository = new StrongRepository();

    expect(repository.hasFor('toString')).toBeTruthy();
    expect(repository.hasFor(Symbol.toStringTag)).toBeTruthy();
    expect(repository.hasFor('@@toStringTag')).toBeTruthy();

    expect(
      repository.findAndConsume('toString', undefined)?.returnValue()
    ).toEqual('mock');
    expect(
      repository.findAndConsume(Symbol.toStringTag, undefined)?.returnValue
    ).toEqual('mock');
    expect(
      repository.findAndConsume('@@toStringTag', undefined)?.returnValue
    ).toEqual('mock');
  });
});
