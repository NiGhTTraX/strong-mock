import { expect } from 'tdd-buffet/expect/jest';
import { describe, it } from 'tdd-buffet/suite/node';
import { Expectation } from '../src/expectation';
import { FIFORepository } from '../src/expectation-repository';

describe('FIFORepository', () => {
  it('should return the first matching expectation with no args', () => {
    const repository = new FIFORepository();

    const expectation1 = new Expectation('bar', undefined, 23);
    const expectation2 = new Expectation('bar', undefined, 42);

    repository.add(expectation1);
    repository.add(expectation2);

    expect(repository.find(undefined, 'bar')).toEqual(expectation1);
  });

  it('should return the first matching expectation with args', () => {
    const repository = new FIFORepository();

    const expectation1 = new Expectation('bar', [1, 2, 3], 23);
    const expectation2 = new Expectation('bar', [1, 2, 3], 42);

    repository.add(expectation1);
    repository.add(expectation2);

    expect(repository.find([1, 2, 3], 'bar')).toEqual(expectation1);
  });

  it('should completely consume an expectation', () => {
    const repository = new FIFORepository();

    const expectation = new Expectation('bar', [1, 2, 3], 23, 1, 1);

    repository.add(expectation);

    expect(repository.find([1, 2, 3], 'bar')).toEqual(expectation);
    expect(repository.find([1, 2, 3], 'bar')).toEqual(undefined);
  });

  it('should not return anything when no matching expectation', () => {
    const repository = new FIFORepository();

    expect(repository.find(undefined, 'bar')).toEqual(undefined);
    expect(repository.getUnmet()).toHaveLength(0);
  });

  it('should keep consuming an expectation', () => {
    const repository = new FIFORepository();

    const expectation = new Expectation('bar', undefined, 23, 0, Infinity);
    repository.add(expectation);

    expect(repository.find(undefined, 'bar')).toEqual(expectation);
    expect(repository.find(undefined, 'bar')).toEqual(expectation);
  });
});
