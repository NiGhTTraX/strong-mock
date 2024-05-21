import { expectAnsilessEqual } from '../../tests/ansiless';
import { printArgsDiff } from './diff';

describe('printArgsDiff', () => {
  it('should print diff for mismatching primitive pair', () => {
    expectAnsilessEqual(
      printArgsDiff(['foo'], ['bar']),
      `-   "foo",
+   "bar"`
    );
  });

  it('should print diff for mismatching primitive pair at the end', () => {
    expectAnsilessEqual(
      printArgsDiff(['foo', 'bar'], ['foo', 'baz']),
      `    "foo",
-   "bar",
+   "baz"`
    );
  });

  it('should print diff for mismatching primitive pair at the beginning', () => {
    expectAnsilessEqual(
      printArgsDiff(['foo', 'bar'], ['bar', 'bar']),
      `-   "foo",
+   "bar",
    "bar"`
    );
  });

  it('should print diff for mismatching consecutive primitive pairs', () => {
    expectAnsilessEqual(
      printArgsDiff(['one', 'two'], ['three', 'four']),
      `-   "one",
-   "two",
+   "three",
+   "four"`
    );
  });

  it('should print diff for mismatching object pair', () => {
    expectAnsilessEqual(
      printArgsDiff([{ foo: 'bar' }], [{ foo: 'baz' }]),
      `    Object {
-     "foo": "bar",
+     "foo": "baz",
    }`
    );

    expectAnsilessEqual(
      printArgsDiff([{ a: 1, b: 2 }], [{ a: 1 }]),
      `    Object {
      "a": 1,
-     "b": 2,
    }`
    );

    expectAnsilessEqual(
      printArgsDiff([{ a: 1 }], [{ a: 1, b: 2 }]),
      `    Object {
      "a": 1,
+     "b": 2,
    }`
    );

    expectAnsilessEqual(
      printArgsDiff([{ a: 1, b: { c: 2 } }], [{ a: 1, b: { c: 3 } }]),
      `    Object {
      "a": 1,
      "b": Object {
-       "c": 2,
+       "c": 3,
      },
    }`
    );
  });

  it('should print diff for mismatching array pair', () => {
    expectAnsilessEqual(
      printArgsDiff([['foo']], [['bar']]),
      `    Array [
-     "foo",
+     "bar",
    ]`
    );
  });

  it('should print diff for missing args', () => {
    expectAnsilessEqual(printArgsDiff(['foo'], []), `-   "foo"`);
    expectAnsilessEqual(
      printArgsDiff(['foo', 'bar'], ['foo']),
      `    "foo",
-   "bar"`
    );
  });

  it('should print diff for extra args', () => {
    expectAnsilessEqual(printArgsDiff([], ['foo']), `+   "foo"`);
    expectAnsilessEqual(
      printArgsDiff(['foo'], ['foo', 'bar']),
      `    "foo",
+   "bar"`
    );
  });

  it('should print diff for undefined args', () => {
    expectAnsilessEqual(
      printArgsDiff(['foo'], [undefined]),
      `-   "foo",
+   undefined`
    );
  });

  it('should print diff for mismatching types', () => {
    expectAnsilessEqual(
      printArgsDiff(['foo'], [{ foo: 'bar' }]),
      `-   "foo",
+   Object {
+     "foo": "bar",
+   }`
    );
  });
});
