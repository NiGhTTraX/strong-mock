import { expect } from 'tdd-buffet/expect/jest';
import { describe, it } from 'tdd-buffet/suite/node';
import { Expectation } from '../src/expectation';
import { FIFORepository } from '../src/expectation-repository';
import { ApplyProp } from '../src/mock';

describe('FIFORepository', () => {
  it('should return the first matching expectation with no args', () => {
    const repository = new FIFORepository();

    const expectation1 = new Expectation(ApplyProp, undefined, 23);
    const expectation2 = new Expectation(ApplyProp, undefined, 42);

    repository.add(expectation1);
    repository.add(expectation2);

    expect(repository.find(undefined, ApplyProp)).toEqual(expectation1);
  });

  it('should return the first matching expectation with args', () => {
    const repository = new FIFORepository();

    const expectation1 = new Expectation(ApplyProp, [1, 2, 3], 23);
    const expectation2 = new Expectation(ApplyProp, [1, 2, 3], 42);

    repository.add(expectation1);
    repository.add(expectation2);

    expect(repository.find([1, 2, 3], ApplyProp)).toEqual(expectation1);
  });

  it('should completely consume an expectation', () => {
    const repository = new FIFORepository();

    const expectation = new Expectation(ApplyProp, [1, 2, 3], 23, 1, 1);

    repository.add(expectation);

    expect(repository.find([1, 2, 3], ApplyProp)).toEqual(expectation);
    expect(repository.find([1, 2, 3], ApplyProp)).toEqual(undefined);
  });

  it('should return undefined when no matching expectation', () => {
    const repository = new FIFORepository();

    expect(repository.find(undefined, ApplyProp)).toEqual(undefined);
  });

  it('should keep consuming an expectation', () => {
    const repository = new FIFORepository();

    const expectation = new Expectation(ApplyProp, undefined, 23, 0, Infinity);
    repository.add(expectation);

    expect(repository.find(undefined, ApplyProp)).toEqual(expectation);
    expect(repository.find(undefined, ApplyProp)).toEqual(expectation);
  });
});
