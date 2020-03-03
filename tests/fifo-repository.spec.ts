import { expect } from 'tdd-buffet/expect/jest';
import { describe, it } from 'tdd-buffet/suite/node';
import { FIFORepository } from '../src/expectation-repository';
import {
  NeverEndingAlwaysMatchingExpectation,
  NeverMatchingExpectation,
  OneUseAlwaysMatchingExpectation
} from './expectations';

describe('FIFORepository', () => {
  it('should return the first matching expectation with no args', () => {
    const repository = new FIFORepository();

    const expectation1 = new NeverMatchingExpectation();
    const expectation2 = new OneUseAlwaysMatchingExpectation();
    const expectation3 = new OneUseAlwaysMatchingExpectation();

    repository.add(expectation1);
    repository.add(expectation2);
    repository.add(expectation3);

    expect(repository.findAndConsume('bar', undefined)).toEqual(expectation2);
  });

  it('should completely consume an expectation', () => {
    const repository = new FIFORepository();

    const expectation = new OneUseAlwaysMatchingExpectation();

    repository.add(expectation);

    expect(repository.findAndConsume('bar', undefined)).toEqual(expectation);
    expect(repository.findAndConsume('bar', undefined)).toEqual(undefined);
    expect(repository.getUnmet()).toHaveLength(0);
  });

  it('should not return any unmet expectations when empty', () => {
    const repository = new FIFORepository();

    expect(repository.findAndConsume('bar', undefined)).toEqual(undefined);
    expect(repository.getUnmet()).toHaveLength(0);
  });

  it('should not return any unmet expectations when min has been satisfied', () => {
    const repository = new FIFORepository();

    const expectation = new NeverEndingAlwaysMatchingExpectation();

    repository.add(expectation);

    expect(repository.getUnmet()).toHaveLength(0);
  });

  it('should keep consuming an expectation', () => {
    const repository = new FIFORepository();

    const expectation = new NeverEndingAlwaysMatchingExpectation();
    repository.add(expectation);

    expect(repository.findAndConsume('bar', undefined)).toEqual(expectation);
    expect(repository.findAndConsume('bar', undefined)).toEqual(expectation);
  });
});
