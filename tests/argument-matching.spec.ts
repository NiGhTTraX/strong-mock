import { expect } from 'tdd-buffet/expect/jest';
import { describe, it } from 'tdd-buffet/suite/node';
import { Expectation } from '../src/expectation';
import { FIFORepository } from '../src/expectation-repository';

describe('FIFORepository argument matching', () => {
  it('should match primitives', () => {
    const repo = new FIFORepository();

    const expectation = new Expectation('bar', [1, '2', true], undefined);
    repo.add(expectation);

    expect(repo.findAndConsume([1, '2', true], 'bar')).toEqual(expectation);
  });

  it('should match objects', () => {
    const repo = new FIFORepository();

    const expectation = new Expectation(
      'bar',
      [
        {
          bar: { baz: 42 }
        }
      ],
      undefined
    );
    repo.add(expectation);

    expect(
      repo.findAndConsume(
        [
          {
            bar: { baz: 42 }
          }
        ],
        'bar'
      )
    ).toEqual(expectation);
  });

  it('should match arrays', () => {
    const repo = new FIFORepository();

    const expectation = new Expectation('bar', [[1, 2, 3]], 23);
    repo.add(expectation);

    expect(repo.findAndConsume([[1, 2, 3]], 'bar')).toEqual(expectation);
  });

  it('should match deep arrays', () => {
    const repo = new FIFORepository();

    const expectation = new Expectation('bar', [[1, 2, [3, 4]]], 23);
    repo.add(expectation);

    expect(repo.findAndConsume([[1, 2, [3, 4]]], 'bar')).toEqual(expectation);
  });

  it('should match sets', () => {
    const repo = new FIFORepository();

    const expectation = new Expectation('bar', [new Set([1, 2, 3])], 23);
    repo.add(expectation);

    expect(repo.findAndConsume([new Set([1, 2, 3])], 'bar')).toEqual(
      expectation
    );
  });

  it('should match maps', () => {
    const repo = new FIFORepository();

    const expectation = new Expectation(
      'bar',
      [
        new Map([
          [1, true],
          [2, false]
        ])
      ],
      23
    );
    repo.add(expectation);

    expect(
      repo.findAndConsume(
        [
          new Map([
            [1, true],
            [2, false]
          ])
        ],
        'bar'
      )
    ).toEqual(expectation);
  });

  it('should match optional args against undefined', () => {
    const repo = new FIFORepository();

    const expectation = new Expectation('bar', [undefined], 23);
    repo.add(expectation);

    expect(repo.findAndConsume([], 'bar')).toEqual(expectation);
  });

  it('should match passed in optional args', () => {
    const repo = new FIFORepository();

    const expectation = new Expectation('bar', [], 23);
    repo.add(expectation);

    expect(repo.findAndConsume([42], 'bar')).toEqual(expectation);
  });

  it('should not match expected optional arg', () => {
    const repo = new FIFORepository();

    const expectation = new Expectation('bar', [23], 23);
    repo.add(expectation);

    expect(repo.findAndConsume([], 'bar')).toBeUndefined();
  });

  it('should not match expected undefined optional arg', () => {
    const repo = new FIFORepository();

    const expectation = new Expectation('bar', [undefined], 23);
    repo.add(expectation);

    expect(repo.findAndConsume([42], 'bar')).toBeUndefined();
  });
});
