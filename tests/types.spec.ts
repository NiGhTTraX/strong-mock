/* eslint-disable @typescript-eslint/no-unused-vars,@typescript-eslint/no-unused-expressions */
import { it } from 'vitest';
import { It, mock, when } from '../src';

it('type safety', () => {
  function mockSafety() {
    const fn = mock<() => void>();

    // @ts-expect-error check function arguments
    fn(23);

    const obj = mock<{ foo: () => void }>();

    // @ts-expect-error check interface method arguments
    obj.foo(23);

    // @ts-expect-error check interface methods
    obj.bar();
  }

  function whenSafety() {
    const fn = mock<() => void>();
    const fnp = mock<() => Promise<void>>();

    // @ts-expect-error check the return type
    when(() => fn()).thenReturn(23);

    // @ts-expect-error don't allow promise returns on non promise
    when(() => fn()).thenResolve;

    // @ts-expect-error throw only errors
    when(() => fn()).thenThrow(23);

    // @ts-expect-error check promise return type
    when(() => fnp()).thenReturn(23);

    // @ts-expect-error check promise return type
    when(() => fnp()).thenResolve(23);

    // @ts-expect-error reject only errors
    when(() => fnp()).thenReject(23);

    // @ts-expect-error promises only reject
    when(() => fnp()).thenThrow;

    // any should not enable the promise helpers

    const fnany = mock<() => any>();
    when(() => fnany()).thenReturn(23);
    // @ts-expect-error because the resolve helper is not expected
    when(() => fnany()).thenResolve(23);
  }

  function partialSafety() {
    It.containsObject(
      // @ts-expect-error empty objects not allowed
      {},
    );
    It.containsObject({ foo: 'bar' });

    const number = (x: number) => x;
    number(
      // @ts-expect-error non-object can't be partial-ed
      It.containsObject({ toString: () => 'bar' }),
    );
    number(
      // @ts-expect-error non-object
      It.containsObject(42),
    );

    const numberArray = (x: number[]) => x;
    // @ts-expect-error array is not an object
    numberArray(It.containsObject({ length: 2 }));

    const nestedObject = (x: { foo: { bar: number; 42: string } }) => x;
    nestedObject(It.isPlainObject());
    nestedObject(It.containsObject({ foo: { bar: 23 } }));
    nestedObject(It.containsObject({ foo: { 42: 'baz' } }));
    nestedObject(
      // @ts-expect-error wrong nested property type
      It.containsObject({ foo: { bar: 'boo' } }),
    );
    nestedObject(
      It.containsObject({
        // @ts-expect-error unexpected key
        unexpected: 42,
      }),
    );
    nestedObject(
      It.containsObject({
        // @ts-expect-error because TS can't infer the proper type
        // See https://github.com/microsoft/TypeScript/issues/55164.
        foo: It.containsObject({ bar: 1 }),
      }),
    );

    interface InterfaceType {
      foo: string;
    }

    const withInterface = (x: InterfaceType) => x;
    withInterface(It.containsObject({ foo: 'bar' }));
    withInterface(
      It.containsObject(
        // @ts-expect-error unexpected key
        { unexpected: 42 },
      ),
    );

    const object = (x: { foo: number }) => x;
    object(It.containsObject({ foo: It.isNumber() }));
    object(
      It.containsObject(
        // @ts-expect-error unexpected key
        { unexpected: It.isNumber() },
      ),
    );
    object(
      It.containsObject({
        // @ts-expect-error wrong nested matcher type
        foo: It.isString(),
      }),
    );

    const objectWithArrays = (x: { foo: { bar: number[] } }) => x;
    objectWithArrays(
      It.containsObject({
        foo: {
          bar: It.isArray([It.isNumber()]),
        },
      }),
    );
    objectWithArrays(
      It.containsObject({
        foo: {
          // @ts-expect-error wrong nexted matcher type
          bar: It.isArray([It.isString()]),
        },
      }),
    );
    objectWithArrays(
      It.containsObject({
        foo: {
          // @ts-expect-error arrays should not be made partial
          bar: [undefined],
        },
      }),
    );

    const objectLikeValues = (data: {
      map: Map<unknown, unknown>;
      set: Set<unknown>;
      arr: Array<unknown>;
    }) => data;
    objectLikeValues({
      // @ts-expect-error Maps are not objects
      map: It.isPlainObject(),
      // @ts-expect-error Sets are not objects
      set: It.isPlainObject(),
      // @ts-expect-error Arrays are not objects
      arr: It.isPlainObject(),
    });
    objectLikeValues({
      // @ts-expect-error Maps are not objects
      map: It.containsObject({}),
      // @ts-expect-error Sets are not objects
      set: It.containsObject({}),
      // @ts-expect-error Arrays are not objects
      arr: It.containsObject({}),
    });
  }

  function matcherSafety() {
    const number = (x: number) => x;
    number(It.isAny());
    // @ts-expect-error wrong matcher type
    number(It.isString());
    // @ts-expect-error wrong matcher type
    number(It.isPlainObject());
    // @ts-expect-error wrong matcher type
    number(It.isArray());

    const numberArray = (x: number[]) => x;
    numberArray(It.isArray());
    numberArray(It.isArray([1, 2, 3]));
    numberArray(It.isArray([It.isNumber()]));
    // @ts-expect-error wrong type of array
    numberArray(It.isArray(['a']));
    // @ts-expect-error wrong nested matcher type
    numberArray(It.isArray([It.isString()]));

    const string = (x: string) => x;
    const startsWith = (expected: string) =>
      It.matches<string>((actual) => actual.startsWith(expected));
    string(startsWith('foo'));

    It.matches<string>(() => true, {
      toString: () => 'foo',
      getDiff: (actual) => ({ actual: actual.toLowerCase(), expected: 'foo' }),
    });

    It.matches<string>(() => true, {
      toString: () => 'foo',
      getDiff: (actual) => ({ actual: actual + 1, expected: 'foo' }),
    });

    const captureMatcher = It.willCapture<number>();
    // The incoming value can be of any type.
    captureMatcher.matches('aaa');
    // @ts-expect-error because the value can be undefined.
    number(captureMatcher.value);
    // @ts-expect-error number is not string

    string(captureMatcher.value!);
  }
});
