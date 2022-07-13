# Types of mocks and instances

## Context

A **Mock** is created with `mock<T>()`. Expectations are set on this.

An **Instance** is created with `instance<Mock<T>>()`. The code under test calls this.

The two values are incompatible, but the types are the same to enable TypeScript IDEs to properly track property access and methods calls and enable automated refactorings. This makes it easy to forget calling `instance` when passing the mock to the code under test, which can result in hard to understand errors. strong-mock currently attempts to make this better by throwing an explicit error, but only on the **second** call from the code under test — the first call can't be distinguished from a call inside `when`.

```typescript
import { mock, when } from 'strong-mock';

const fn = mock<(x: number) => number>();

when(fn(23)).thenReturn(42);

// Forgot to call instance, prints undefined.
console.log(fn(23));
```

If we want to keep `instance`, the above example should ideally result in a type error. Alternatively, we could try getting rid of `instance`, which would require changes to the `when` API, so we can distinguish between expectations and actual calls.

## Decision drivers

- how "natural" it feels to write expectations with `when`
- reducing the chances of mistakes in tests
- IDE refactorings should work across tests and production code

## Considered options

The following options have been previously described in https://github.com/NiGhTTraX/strong-mock/issues/231.

### Mapped types

This changes the return type of every property in the mocked type to something incompatible, maintaining the syntax in `when` but making it impossible (for most cases) to use the mock without `instance` (which would convert back to the original type).

```typescript
// This is the incompatible return type.
type MockReturn<T> = { r: T };

type ObjectMock<T> = {
  [K in keyof T]: T[K] extends (...args: infer A) => infer R
    ? (...args: A) => MockReturn<R>
    : MockReturn<T[K]>;
};

type Mock<T> = T extends (...args: infer A) => infer R
  ? ((...args: A) => MockReturn<R>) & ObjectMock<T>
  : ObjectMock<T>;

// Not shown here, the type for instance would go back to the original T.
```

#### Pros

It preserves the syntax of current API, while making nested property access a type error (currently it's a runtime exception).

#### Cons

Brittle and could break unforeseen edge cases in either mock types, or IDE refactoring. If we go with this and run into one of those edge cases, reverting would most likely be the only option to fix it. It also doesn't cover `void` return types.

At the time of writing, this breaks function overloads, see https://github.com/microsoft/TypeScript/issues/29732.

### Properties on the mock object

This moves the original type under an extra property on the mock, e.g., `mock.expect`. `instance` could be moved to `mock.instance`, but is not necessary, since the mock and instance types will now be different.

```typescript
when(foo.expect.bar()).thenReturn('baz');

console.log(instance(foo).bar()); // baz
// alternatively
console.log(foo.instance.bar()); // baz
```

#### Pros

It's pretty straightforward to implement, by just moving the return of `mock()` under a key. The mocked type is fully preserved under that key, enabling IDE refactorings, and `instance` could also be moved under a second key, saving an import. Users could easily migrate with a RegExp search-and-replace.

#### Cons

It will be a breaking change for `when`, potentially for `instance` as well.

It also adds extra syntax when writing expectations, and IMO becomes confusing for function types (`when(foo.expect())`).

### Callback inside `when`

By making the expectations inside a callback, we can get rid of `instance` by switching the mock between recording and fetching modes when the callback is executed.

```typescript
when(() => foo.bar()).thenReturn('baz')

console.log(foo.bar()); // baz
```

#### Pros

It's pretty straightforward to implement, by unifying the code for `mock()` and `instance()`, and having a conditional to choose between setting an expectation, or retrieving one from the repository.

The mocked type is fully preserved, enabling IDE refactorings, and this syntax could enable setter expectations `when(() => { foo.bar = 42; })`.

Users can migrate with a RegExp search-and-replace.

#### Cons

This will be a breaking change for `when` and `instance`.

It also adds extra syntax when writing expectations, but it shouldn't feel too distracting.

### Setup for `when`

Similar to the previous option, we can use a single callback to perform all `when` expectations.

```typescript
setup(() => {
  when(foo.bar()).thenReturn('baz');
});

console.log(foo.bar()); // baz
```

#### Pros

This extends the original API of `when`, and is very similar to React's [act](https://reactjs.org/docs/test-utils.html#act), which is to say it aligns with another widely known API.

#### Cons

This will be a breaking change for `when` and `instance`.

It also adds an extra import, and for tests with a single expectation it adds a bit of boilerplate.

Like React's `act`, it will result in a runtime error if you forget to use it. It will be an explicit `UnexpectedAccess` error, even on the first call, so that will be better than the current behavior (see [Context](#context)).

## Decision outcome

The [`when` callback option](#callback-inside-when) has the most advantages, while having the least disadvantages.

## Consequences

By removing `instance`, the API surface becomes smaller and more cohesive.
