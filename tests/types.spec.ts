/* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */
import { it } from 'tdd-buffet/suite/node';
import { instance, mock, when } from '../src';

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
    when(fn()).thenReturn(23);

    // @ts-expect-error don't allow promise returns on non promise
    when(fn()).thenResolve;

    // @ts-expect-error throw only errors
    when(fn()).thenThrow(23);

    // @ts-expect-error check promise return type
    when(fnp()).thenReturn(23);

    // @ts-expect-error check promise return type
    when(fnp()).thenResolve(23);

    // @ts-expect-error reject only errors
    when(fnp()).thenReject(23);

    // @ts-expect-error promises only reject
    when(fnp()).thenThrow;
  }

  function instanceSafety() {
    const fn = mock<() => void>();

    // @ts-expect-error check function arguments
    instance(fn)(23);

    // @ts-expect-error check function return
    const x: number = instance(fn)();

    const obj = mock<{ foo: () => void }>();

    // @ts-expect-error check interface method arguments
    instance(obj).foo(23);

    // @ts-expect-error check interface methods
    instance(obj).bar();

    // @ts-expect-error check interface method return
    const y: number = instance(obj).foo();
  }
});
