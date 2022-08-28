/* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */
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
    // @ts-expect-error
    when(() => fnany()).thenResolve(23);
  }

  function matcherSafety() {
    const number = (x: number) => x;
    number(It.isAny());
    // @ts-expect-error wrong matcher type
    number(It.isString());

    const nestedObject = (x: { foo: { bar: number; baz: string } }) => x;
    nestedObject(It.isObject());
    nestedObject(It.isObject({ foo: { bar: 23 } }));
    nestedObject(
      // @ts-expect-error wrong nested property type
      It.isObject({ foo: { bar: 'boo' } })
    );
    // TODO: open an issue in TS repo
    // @ts-expect-error because TS can't infer the proper type
    nestedObject(It.isObject({ foo: It.isObject() }));

    const numberArray = (x: number[]) => x;
    numberArray(It.isArray());
    numberArray(It.isArray([1, 2, 3]));
    numberArray(It.isArray([It.isNumber()]));
    // @ts-expect-error wrong type of array
    numberArray(It.isArray(['a']));
    // @ts-expect-error wrong nested matcher type
    numberArray(It.isArray([It.isString()]));

    const object = (x: { foo: number }) => x;
    object(It.isObject({ foo: It.isNumber() }));
    object(
      // @ts-expect-error wrong nested matcher type
      It.isObject({ foo: It.isString() })
    );

    const objectWithArrays = (x: { foo: { bar: number[] } }) => x;
    objectWithArrays(
      It.isObject({
        foo: {
          bar: It.isArray([It.isNumber()]),
        },
      })
    );
    objectWithArrays(
      It.isObject({
        foo: {
          // @ts-expect-error wrong nexted matcher type
          bar: It.isArray([It.isString()]),
        },
      })
    );

    const string = (x: string) => string;
    const captureMatcher = It.willCapture<number>();
    // The incoming value can be of any type.
    captureMatcher.matches('aaa');
    // @ts-expect-error because the value can be undefined.
    number(captureMatcher.value);
    // @ts-expect-error number is not string
    string(captureMatcher.value!);
  }
});
