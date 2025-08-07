<!--suppress HtmlDeprecatedAttribute -->
<div align="center">
<h1>💪 strong-mock</h1>

<p>Type safe mocking library for TypeScript</p>
</div>

```typescript
import { mock, when } from 'strong-mock';

interface Foo {
  bar: (x: number) => string;
}

const foo = mock<Foo>();

when(() => foo.bar(23)).thenReturn('I am strong!');

console.log(foo.bar(23)); // 'I am strong!'
```

----

![Build Status](https://github.com/NiGhTTraX/strong-mock/workflows/Tests/badge.svg) [![codecov](https://codecov.io/gh/NiGhTTraX/strong-mock/branch/master/graph/badge.svg)](https://codecov.io/gh/NiGhTTraX/strong-mock) ![npm type definitions](https://img.shields.io/npm/types/strong-mock.svg)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Features](#features)
  - [Type safety](#type-safety)
  - [Matchers](#matchers)
  - [Awesome error messages](#awesome-error-messages)
  - [Works with Promises and Errors](#works-with-promises-and-errors)
- [Installation](#installation)
- [API](#api)
  - [Mock](#mock)
    - [Mocking types and interfaces](#mocking-types-and-interfaces)
    - [Mocking functions](#mocking-functions)
  - [When](#when)
    - [Setting expectations](#setting-expectations)
    - [Setting multiple expectations](#setting-multiple-expectations)
    - [Matchers](#matchers-1)
    - [Custom matchers](#custom-matchers)
  - [Then](#then)
    - [Setting invocation count expectations](#setting-invocation-count-expectations)
    - [Returning promises](#returning-promises)
    - [Throwing errors](#throwing-errors)
  - [Verify](#verify)
    - [Verifying expectations](#verifying-expectations)
  - [Reset](#reset)
    - [Resetting expectations](#resetting-expectations)
- [Mock options](#mock-options)
  - [Unexpected property return value](#unexpected-property-return-value)
  - [Exact params](#exact-params)
  - [Concrete matcher](#concrete-matcher)
- [FAQ](#faq)
  - [Why do I have to set all expectations first?](#why-do-i-have-to-set-all-expectations-first)
  - [Why do I have to set a return value even if it's `undefined`?](#why-do-i-have-to-set-a-return-value-even-if-its-undefined)
  - [Why do I get a `Didn't expect mock to be called` error?](#why-do-i-get-a-didnt-expect-mock-to-be-called-error)
  - [Can I partially mock a concrete implementation?](#can-i-partially-mock-a-concrete-implementation)
  - [How do I set expectations on setters?](#how-do-i-set-expectations-on-setters)
  - [How do I provide a function for the mock to call?](#how-do-i-provide-a-function-for-the-mock-to-call)
  - [Can I spread or enumerate a mock?](#can-i-spread-or-enumerate-a-mock)
  - [Why does `typeof mock()` return `function`?](#why-does-typeof-mock-return-function)
  - [How can I ignore `undefined` keys when setting expectations on objects?](#how-can-i-ignore-undefined-keys-when-setting-expectations-on-objects)
  - [How can I verify order of calls?](#how-can-i-verify-order-of-calls)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Features

### Type safety

The mocks will share the same types as your production code, and you can safely refactor in an IDE knowing that all usages will be updated.

![Renaming production code and test code](media/rename-refactor.gif)

### Matchers

You can use matchers to partially match values, or create complex expectations, while still maintaining type safety.

![Type safe matchers](media/type-safe-matchers.png)

### Awesome error messages

Failed expectations will print a visual diff, and even integrate with the IDE.

```typescript
import { mock, when } from 'strong-mock';

const fn = mock<(pos: { x: number; y: number }) => boolean>();

when(() =>
  fn(
    It.containsObject({
      x: It.isNumber(),
      y: It.matches<number>((y) => y > 0)
    })
  )
).thenReturn(true);

fn({ x: 1, y: -1 });
```

![Test output from the IDE showing details about a failed mock expectation](media/error-messages.png)

### Works with Promises and Errors

```typescript
import { mock, when } from 'strong-mock';

const fn = mock<(id: number) => Promise<string>>();

when(() => fn(42)).thenResolve('foo');
when(() => fn(-1)).thenReject('oops');

console.log(await fn(42)); // foo

try {
  await fn(-1);
} catch (e) {
  console.log(e.message); // oops
}
```

## Installation

```shell
npm i -D strong-mock
```

```shell
yarn add -D strong-mock
```

```shell
pnpm add -D strong-mock
```

## API

### Mock

#### Mocking types and interfaces

Pass in the type or interface to the generic argument of `mock`:

```typescript
interface Foo {
  bar: (x: number) => string;
  baz: number;
}

const foo = mock<Foo>();

when(() => foo.bar(23)).thenReturn('awesome');
when(() => foo.baz).thenReturn(100);

console.log(foo.bar(23)); // 'awesome'
console.log(foo.baz); // 100
```

#### Mocking functions

You can also mock function types:

```typescript
type Fn = (x: number) => number;

const fn = mock<Fn>();

when(() => fn(1)).thenReturn(2);

console.log(fn(1)); // 2
```

### When

#### Setting expectations

Expectations are set by calling the mock inside a `when` callback and setting a return value.

```typescript
when(() => foo.bar(23)).thenReturn('awesome');
```

#### Setting multiple expectations

You can set as many expectations as you want by calling `when` multiple times. If you have multiple expectations with the same arguments they will be consumed in the order they were created.

```typescript
when(() => foo.bar(23)).thenReturn('awesome');
when(() => foo.bar(23)).thenReturn('even more awesome');

console.log(foo.bar(23)); // awesome
console.log(foo.bar(23)); // even more awesome
```

#### Matchers

Sometimes you're not interested in specifying all the arguments in an expectation. Maybe they've been covered in another test, maybe they're hard to specify e.g. callbacks, or maybe you want to match just a property from an argument.

```typescript
const fn = mock<
  (x: number, data: { values: number[]; labels: string[] }) => string
>();

when(() => fn(
  It.isNumber(),
  It.containsObject({ values: [1, 2, 3] })
)).thenReturn('matched!');

console.log(fn(
  123, 
  { values: [1, 2, 3], labels: ['a', 'b', 'c'] })
); // 'matched!'
```

You can mix matchers with concrete arguments:

```typescript
when(() => fn(42, It.isPlainObject())).thenReturn('matched');
```

Available matchers:
- `deepEquals` - the default ([can be changed](#concrete-matcher), uses deep equality,
- `is` - uses `Object.is` for comparison,
- `isAny` - matches anything,
- `isNumber` - matches any number,
- `isString` - matches any string, can search for substrings and patterns,
- `isArray` - matches any array, can search for subsets,
- `isPlainObject` - matches any plain object,
- `containsObject` - recursively matches a subset of an object,
- `willCapture` - matches anything and [stores](#custom-matchers) the received value,
- `matches` - [build your own matcher](#custom-matchers).

The following table illustrates the differences between the equality matchers:

| expected           | actual               | `It.is`   | `It.deepEquals` | `It.deepEquals({ strict: false })` |
|--------------------|----------------------|-----------|-----------------|------------------------------------|
| `"foo"`            | `"foo"`              | equal     | equal           | equal                              |
| `{ foo: "bar" }`   | `{ foo: "bar" }`     | not equal | equal           | equal                              |
| `{ }`              | `{ foo: undefined }` | not equal | not equal       | equal                              |
| `new (class {})()` | `new (class {})()`   | not equal | not equal       | equal                              |

You can nest matchers in `deepEquals`, `containsObject` and `isArray`:

```typescript
type Point = { label: string; value: number };
const fn = mock<(data: { points: Point[]; title: string }) => number>();

// deepEquals is the default matcher so you can omit it.
when(() => fn({
  points: It.isArray([
    It.containsObject({
      value: It.matches(x => x > 0)
    })
  ]),
  title: It.isString(/foo/)
})).thenReturn(100);
```

#### Custom matchers

`It.willCapture` will match any value and store it, so you can access it outside an expectation. This could be useful to capture a callback and then test it separately.

```ts
type Cb = (value: number) => number;

const fn = mock<(cb: Cb) => number>();

const matcher = It.willCapture<Cb>();
when(() => fn(matcher)).thenReturn(42);

console.log(fn(23, (x) => x + 1)); // 42
console.log(matcher.value?.(3)); // 4
```

With `It.matches` you can create arbitrarily complex and type safe matchers:

```typescript
const fn = mock<(x: number, y: string) => string>();

when(() => fn(
  It.matches(x => x > 0),
  It.matches(y => y.startsWith('foo'))
)).thenReturn('matched');
```

The types are automatically inferred, but you can also specify them explicitly through the generic parameter, which is useful if you want to create reusable matchers:

```typescript
const startsWith = (expected: string) => It.matches<string>(
  actual => actual.startsWith(expected)
);

when(() => fn(42, startsWith('foo'))).thenReturn('matched');

fn(42, 'foobar') // 'matched'
```

You can also customize how the matcher is printed in error messages, and how the diff is printed:

```typescript
const closeTo = (expected: number, precision = 0.01) => It.matches<number>(
  actual => Math.abs(expected - actual) <= precision,
  {
    toString: () => `closeTo(${expected}, ${precision})`,
    getDiff: (actual) => {
      const diff = Math.abs(expected - actual);
      const sign = diff < 0 ? '-' : '+';
      
      return {
        actual: `${actual} (${sign}${diff})`,
        expected: `${expected} ±${precision}`,
      };
    }
  }
);

when(() => fn(closeTo(1), 'foo')).thenReturn('matched');

fn(2, 'foo');
```

![Error message for custom matcher](media/custom-matcher-error.png)

### Then

#### Setting invocation count expectations

By default, each call is expected to be made only once. You can expect a call to be made multiple times by using the invocation count helpers `between`, `atLeast`, `times`, `anyTimes` etc.:

```typescript
const fn = mock<(x: number) => number>();

when(() => fn(1)).thenReturn(1).between(2, 3);

console.log(fn(1)); // 1
console.log(fn(1)); // 1
console.log(fn(1)); // 1
console.log(fn(1)); // throws because the expectation is finished
```

You'll notice there is no `never()` helper - if you expect a call to not be made simply don't set an expectation on it and the mock will throw if the call happens.

#### Returning promises

If you're mocking something that returns a promise then you'll be able to use the `thenResolve` promise helper to set the return value.

```typescript
type Fn = (x: number) => Promise<number>;

const fn = mock<Fn>();

when(() => fn(1)).thenResolve(42);

console.log(await fn(1)); // 42
```

You can also use `thenReturn` with a Promise value:

```typescript
when(() => fn(1)).thenReturn(Promise.resolve(42));
```

#### Throwing errors

Use `thenThrow` or `thenReject` to throw an `Error` instance. You can customize the error message, or even pass a derived class.

```typescript
type Fn = (x: number) => void;
type FnWithPromise = (x: number) => Promise<void>;

class MyError extends Error {}

const fn = mock<Fn>();
const fnWithPromise = mock<FnWithPromise>();

// All of these will throw an Error instance.
when(() => fn(1)).thenThrow();
when(() => fn(2)).thenThrow(MyError);
when(() => fnWithPromise(1)).thenReject('oops');
```

### Verify

#### Verifying expectations

Calling `verify(myMock)` will make sure that all expectations set on the mock have been met, and that no additional calls have been made.

```typescript
const fn = mock<(x: number) => number>();

when(() => fn(1)).thenReturn(1).between(2, 10);

verify(fn); // throws UnmetExpectations
```

It will also throw if any unexpected calls happened that were maybe caught in the code under test.

```typescript
const fn = mock<() => void>();

try {
  fn(); // throws because the call is unexpected
} catch(e) {
  // your code might transition to an error state here
}

verify(fn); // throws UnexpectedCalls
```

It is recommended that you call `verify()` on your mocks at the end of every test. This will make sure you don't have any unused expectations in your tests and that your code did not silently catch any of the errors that are thrown when an unexpected call happens. You can use `verifyAll()` to check all existing mocks.

```typescript
afterEach(() => {
  verifyAll();
});
```

![verify error](media/verify.png)

### Reset

#### Resetting expectations

You can remove all expectations from a mock by using the `reset()` method:

```typescript
const fn = mock<(x: number) => number>();

when(() => fn(1)).thenReturn(1);

reset(fn);

fn(1); // throws
```

If you create common mocks that are shared by multiple tests you should reset them before each test. You can use `resetAll()` to reset all existing mocks.

```typescript
beforeEach(() => {
  resetAll();
});
```

## Mock options

The following options can be set per mock, or globally with `setDefaults`.

```typescript
import { mock, when, setDefaults } from 'strong-mock';

setDefaults({
  exactParams: true
});

// Uses the new default.
const superStrictMock = mock<() => void>();
// Overrides the default.
const strictMock = mock<() => void>({ exactParams: false });
```

### Unexpected property return value

You can control what happens whenever an unexpected property is accessed, or an unexpected call is made.

```typescript
import { mock, when, UnexpectedProperty } from 'strong-mock';

type Foo = {
  bar: (value: number) => number;
}

// This is the default.
const callsThrow = mock<Foo>({
  unexpectedProperty: UnexpectedProperty.CALL_THROW
});

// Accessing properties with no expectations is fine.
callsThrow.bar;
// Throws "Didn't expect bar(42) to be called".
callsThrow.bar(42);

const propertiesThrow = mock<Foo>({
  unexpectedProperty: UnexpectedProperty.THROW
});

// Throws "Didn't expect property bar to be accessed".
propertiesThrow.bar;
// Throws "Didn't expect property bar to be accessed".
propertiesThrow.bar(42);
```

### Exact params

By default, function/method expectations will allow more arguments to be received than expected. Since the expectations are type-safe, the TypeScript compiler will never allow expecting fewer arguments than required. Unspecified optional arguments will be considered ignored, as if they've been replaced with [matchers](#matchers-1).

```typescript
import { mock } from 'strong-mock';

const fn = mock<(value?: number) => number>();

when(() => fn()).thenReturn(42).twice();

// Since the expectation doesn't expect any arguments,
// both of the following are fine
console.log(fn()); // 42
console.log(fn(1)); // 42
```

If you're not using TypeScript, or you want to be super strict, you can set `exactParams: true`.

```typescript
import { mock } from 'strong-mock';

const fn = mock<(optionalValue?: number) => number>({
  exactParams: true
});

when(() => fn()).thenReturn(42).twice();

console.log(fn()); // 42
console.log(fn(1)); // throws
```

### Concrete matcher

You can configure the [matcher](#matchers-1) that will be used in expectations with concrete values e.g. `42` or `{ foo: "bar" }`. This matcher can always be overwritten inside an expectation with another matcher.

```typescript
import { mock, when, It } from 'strong-mock';

// Use strict equality instead of deep equality.
const fn = mock<(x: number[], y: string) => boolean>({
  concreteMatcher: It.is
});
when(() => fn([1, 2, 3], 'foo')).thenReturn(true);

fn([1, 2, 3], 'foo'); // throws because different array instances

const arr = [1, 2, 3];
// The matcher will only apply to non-matcher arguments.
when(() => fn(arr, It.isString())).thenReturn(true);
console.log(fn(arr, 'any string')); // true
```

## FAQ

### Why do I have to set all expectations first?

This library is different from other mocking/spying libraries you might have used before such as [sinon](https://sinonjs.org) or [jest](https://jestjs.io/docs/en/mock-functions). Whereas those libraries are focused on recording calls to the mocks and always returning something, strong-mock requires you to set your expectations upfront. If a call happens that is not expected the mock will throw an error.

This design decision has a few reasons behind it. First, it forces you to be aware of what your code needs from its dependencies. Spying libraries encourage checking those needs at the end of the test after the code has already called the mocks. This can lead to tests missing dependency calls that just happen to not throw any error at runtime with the dummy values that the spies return.

Secondly, it will highlight potential design problems such as violations of the SOLID principles. If you find yourself duplicating expectations between tests and passing dummy values to them because your test is not concerned with them, then you might want to look into splitting the code to only depend on things it really needs.

### Why do I have to set a return value even if it's `undefined`?

To make side effects explicit and to prevent future refactoring headaches. If you had just `when(() => fn())`, and you later changed `fn()` to return a `number`, then your expectation would become incorrect and the compiler couldn't check that for you.

### Why do I get a `Didn't expect mock to be called` error?

This error happens when your code under test calls a mock that didn't have a matching expectation. It could be that the arguments received didn't match the ones set in the expectation (see [matchers](#matchers-1)), or the call was made more than the allowed number of times (see [invocation count expectations](#setting-invocation-count-expectations)).

In rare cases, the code under test may try to inspect the mock by accessing special properties on it. For instance, wrapping a mock in `Promise.resolve()` will try to access a `.then` property on it. strong-mock returns stub values for most of these, but if you find another one feel free to [open an issue](https://github.com/NiGhTTraX/strong-mock/issues) with a minimal reproduction.

Unfortunately, not all of these cases can be covered with stub values, and you may have to slightly adjust your code to work around this issue.

### Can I partially mock a concrete implementation?

No, passing a concrete implementation to `mock()` will be the same as passing a type: all properties will be mocked, and you have to set expectations on the ones that will be accessed.

### How do I set expectations on setters?

You currently can't do that. Please use a normal method instead e.g. `setFoo()` vs `set foo()`.

### How do I provide a function for the mock to call?

There is no `thenCall()` method because it can't be safely typed - the type for `thenReturn()` is inferred from the return type in `when`, meaning that the required type would be the return value for the function, not the function itself. However, we can leverage this by setting an expectation on the function property instead:

```typescript
interface Foo {
  bar: (x: number) => string;
}

const foo = mock<Foo>();

when(() => foo.bar).thenReturn(x => `called ${x}`);

console.log(foo.bar(23)); // 'called 23'
```

The function in `thenReturn()` will be type checked against the actual interface, so you can make sure you're passing in an implementation that makes sense. Moreover, refactoring the interface will also refactor the expectation (in a capable IDE).

### Can I spread or enumerate a mock?

Yes, and you will only get the properties that have expectations on them.

```typescript
const foo = mock<{ bar: number; baz: number }>();
when(() => foo.bar).thenReturn(42);

console.log(Object.keys(foo)); // ['bar']

const foo2 = { ...foo };

console.log(foo2.bar); // 42
console.log(foo2.baz); // undefined
```

### Why does `typeof mock()` return `function`?

All mocks and methods on them are functions in order to intercept function calls.

### How can I ignore `undefined` keys when setting expectations on objects?

Use the `It.deepEquals` matcher explicitly inside `when` and pass `{ strict: false }`:

```ts
const fn = mock<(x: { foo: string, bar?: string }) => boolean>();

when(() => fn(
  It.deepEquals({ foo: "bar" }, { strict: false }))
).thenReturn(true);

fn({ foo: "bar", baz: undefined }) === true
```

You can set this behavior to be the default by configuring the [concrete matcher](#concrete-matcher).

```ts
setDefaults({
  concreteMatcher: (expected) => It.deepEquals(expected, { strict: false })
});
```

### How can I verify order of calls?

`when()` expectations can be satisfied in any order. If your code under test depends on a specific order of execution, consider redesigning it to remove the coupling before the different calls.
