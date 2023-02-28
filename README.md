<!--suppress HtmlDeprecatedAttribute -->
<div align="center">
<h1>💪 strong-mock</h1>

<p>Simple type safe mocking library</p>
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
  - [Useful error messages](#useful-error-messages)
  - [Type safe argument matchers](#type-safe-argument-matchers)
- [Installation](#installation)
- [Requirements](#requirements)
- [API](#api)
  - [Setting expectations](#setting-expectations)
  - [Setting multiple expectations](#setting-multiple-expectations)
  - [Setting invocation count expectations](#setting-invocation-count-expectations)
  - [Mocking interfaces](#mocking-interfaces)
  - [Mocking functions](#mocking-functions)
  - [Mocking promises](#mocking-promises)
  - [Throwing errors](#throwing-errors)
  - [Verifying expectations](#verifying-expectations)
  - [Resetting expectations](#resetting-expectations)
  - [Argument matchers](#argument-matchers)
- [Mock options](#mock-options)
  - [Unexpected property return value](#unexpected-property-return-value)
  - [Exact params](#exact-params)
  - [Concrete matcher](#concrete-matcher)
- [FAQ](#faq)
  - [Why do I have to set all expectations first?](#why-do-i-have-to-set-all-expectations-first)
  - [Why do I get a `Didn't expect mock to be called` error?](#why-do-i-get-a-didnt-expect-mock-to-be-called-error)
  - [Why do I have to set a return value even if it's `undefined`?](#why-do-i-have-to-set-a-return-value-even-if-its-undefined)
  - [Can I partially mock an existing object/function?](#can-i-partially-mock-an-existing-objectfunction)
  - [How do I set expectations on setters?](#how-do-i-set-expectations-on-setters)
  - [How do I provide a function for the mock to call?](#how-do-i-provide-a-function-for-the-mock-to-call)
  - [Can I spread/enumerate a mock?](#can-i-spreadenumerate-a-mock)
  - [How can I ignore `undefined` keys when setting expectations on objects?](#how-can-i-ignore-undefined-keys-when-setting-expectations-on-objects)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Features

### Type safety

The mock expectations will share the same type guarantees as your production code, and you can safely refactor in an IDE knowing that all usages will be updated.

![Renaming production code and test code](media/rename-refactor.gif)

### Useful error messages

Error messages include the property that has been accessed, any arguments passed to it and any remaining unmet expectations.

```typescript
import { mock, when } from 'strong-mock';

const fn = mock<(a: number, b: number, c: number) => number>();

when(() => fn(1, 2, 3)).thenReturn(42);

fn(4, 5, 6);
```

![Test output showing details about mock expectations](media/error-messages.png)

### Type safe argument matchers

You can use argument matchers to partially match values, or create complex expectations, while still maintaining type safety.

![Type safe matcher showing a type error](media/type-safe-matchers.png)

## Installation

```shell
npm i -D strong-mock
```

```shell
yarn add -D strong-mock
```

## Requirements

strong-mock requires an environment that supports the [ES6 Proxy object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy). This is necessary to create dynamic mocks from types because TypeScript does not support reflection i.e. exposing the type info at runtime.

## API

### Setting expectations

Expectations are set by calling the mock inside a `when` callback and finishing it by setting a return value.

```typescript
when(() => foo.bar(23)).thenReturn('awesome');
```

### Setting multiple expectations

You can set as many expectations as you want by calling `when` multiple times. If you have multiple expectations with the same arguments they will be consumed in the order they were created.

```typescript
when(() => foo.bar(23)).thenReturn('awesome');
when(() => foo.bar(23)).thenReturn('even more awesome');

console.log(foo.bar(23)); // awesome
console.log(foo.bar(23)); // even more awesome
```

### Setting invocation count expectations

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

### Mocking interfaces

Pass in the interface to the generic argument of `mock`:

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

### Mocking functions

You can also mock functions similarly to interfaces:

```typescript
type Fn = (x: number) => number;

const fn = mock<Fn>();

when(() => fn(1)).thenReturn(2);

console.log(fn(1)); // 2
```

### Mocking promises

If you're mocking something that returns a promise then you'll be able to use the `thenResolve` promise helper to set the return value.

```typescript
type Fn = (x: number) => Promise<number>;

const fn = mock<Fn>();

when(() => fn(1)).thenResolve(2);

console.log(await fn(1)); // 2
```

### Throwing errors

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

### Verifying expectations

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
})
```

![verify error](./media/verify.png)

### Resetting expectations

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
})
```

### Argument matchers

Sometimes you're not interested in specifying all the arguments in an expectation. Maybe they've been covered in another test, maybe they're hard to specify e.g. callbacks, or maybe you want to match just a property from an argument.

```typescript
const fn = mock<
  (x: number, data: { values: number[]; labels: string[] }) => string
>();

when(() => fn(
  It.isAny(),
  It.isObject({ values: [1, 2, 3] })
)).thenReturn('matched!');

console.log(fn(
  123, 
  { values: [1, 2, 3], labels: ['a', 'b', 'c'] })
); // 'matched!'
```

You can mix argument matchers with concrete arguments:

```typescript
when(() => fn(42, It.isObject())).thenReturn('matched');
```

Available matchers:
- `deepEquals` - the default, uses deep equality,
- `is` - uses `Object.is` for comparison,
- `isAny` - matches anything,
- `isNumber` - matches any number,
- `isString` - matches any string, can search for substrings and patterns,
- `isArray` - matches any array, can search for subsets,
- `isObject` - matches any object, can search for partial objects,
- `matches` - build your own matcher,
- `willCapture` - matches anything and stores the received value.

The following table illustrates the differences between the equality matchers:

| expected           | actual               | `It.is`   | `It.deepEquals` | `It.deepEquals({ strict: false })` |
|--------------------|----------------------|-----------|-----------------|------------------------------------|
| `"foo"`            | `"foo"`              | equal     | equal           | equal                              |
| `{ foo: "bar" }`   | `{ foo: "bar" }`     | not equal | equal           | equal                              |
| `{ }`              | `{ foo: undefined }` | not equal | not equal       | equal                              |
| `new (class {})()` | `new (class {})()`   | not equal | not equal       | equal                              |

Some matchers, like `isObject` and `isArray` support nesting matchers:

```typescript
It.isObject({ foo: It.isString() })

It.isArray([ It.isObject({
  foo: It.isString({ matching: /foo/ })
})])
```

You can create arbitrarily complex and type safe matchers with `It.matches(cb)`:

```typescript
const fn = mock<(x: number, y: number[]) => string>();

when(() => fn(
  It.matches(x => x > 0),
  It.matches(y => y.includes(42))
)).thenReturn('matched');
```

`It.willCapture` is a special matcher that will match any value and store it, so you can access it outside an expectation. This could be useful to capture a callback and then test it separately.

```ts
type Cb = (value: number) => number;

const fn = mock<(cb: Cb) => number>();

const matcher = It.willCapture<Cb>();
when(() => fn(matcher)).thenReturn(42);

console.log(fn(23, (x) => x + 1)); // 42
console.log(matcher.value?.(3)); // 4
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

By default, function/method expectations will allow more arguments to be received than expected. Since the expectations are type safe, the TypeScript compiler will never allow expecting less arguments than required. Unspecified optional arguments will be considered ignored, as if they've been replaced with [argument matchers](#argument-matchers).

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

You can configure the [matcher](#argument-matchers) that will be used in expectations with concrete values e.g. `42` or `{ foo: "bar" }`. This matcher can always be overwritten inside an expectation with another matcher.

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

### Why do I get a `Didn't expect mock to be called` error?

This error happens when your code under test calls a method from the mock, or the mock itself if it's a function, that didn't have a matching expectation. It could be that the arguments received didn't match the ones set in the expectation (see [argument matchers](#argument-matchers)), or the call was made more than the allowed number of times (see [invocation count expectations](#setting-invocation-count-expectations)).

In rare cases, the code under test may try to inspect the mock by accessing special properties on it. For instance, React's `setState(state)` accepts 2 types of values: functions and everything else. To differentiate between the 2 types, React will internally do a `typeof` check. All mocks created by strong-mock return `'function'` for this check, so React will try to call them in case you pass them directly to `setState`. This might lead to the `Didn't expect mock(...) to be called` error, as the mock receives the previous state and doesn't find an expectation for it.

If you run into any of these cases, feel free to [open an issue](https://github.com/NiGhTTraX/strong-mock/issues) with a minimal reproduction. Most of the time the issue can be fixed by returning stubbed values for these special properties.

Unfortunately, this is not always possible, such as with the React example above. You might have to adjust your code slightly to work around the checks your code, or some library, is doing. With React, simply putting the mock inside an object e.g. `setState({ foo: theMock })` will avoid the `typeof` check and work as expected.

### Why do I have to set a return value even if it's `undefined`?

To make side effects explicit and to prevent future refactoring headaches. If you had just `when(() => fn())`, and you later changed `fn()` to return a `number`, then your expectation would become incorrect and the compiler couldn't check that for you.

### Can I partially mock an existing object/function?

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

### Can I spread/enumerate a mock?

Yes, and you will only get the properties that have expectations on them.

```typescript
const foo = mock<{ bar: number; baz: number }>();
when(() => foo.bar).thenReturn(42);

console.log(Object.keys(foo)); // ['bar']

const foo2 = { ...foo };

console.log(foo2.bar); // 42
console.log(foo2.baz); // undefined
```

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
