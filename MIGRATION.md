# Migrating to v9

## `It.isObject`

The `It.isObject` matcher has been removed and replaced by 2 new matchers:
- `It.isPlainObject`: only matches plain objects e.g. object literals, doesn't accept a partial value,
- `It.containsObject`: always accepts a partial value and recursively matches it, similar to the old `It.isObject(partial)`.

```diff
-when(() => fn(It.isObject({ foo: 'bar })).thenReturn(1);
-when(() => fn(It.containsObject({ foo: 'bar })).thenReturn(1);

+when(() => fn(It.isObject()).thenReturn(1);
+when(() => fn(It.isPlainObject()).thenReturn(1);
```

The old `It.isObject` had inconsistent behavior when matching plain objects vs object-like values like arrays and classes, depending on whether a partial value was passed in or not. The new matchers should hopefully be more clear.

## `It.isString`

The `It.isString()` matcher supports matching by substring, or by RegExp. The `containing` and `matching` options were removed in favor of a single unnamed argument, to bring it in line with `It.isArray` and the new `It.containsObject`:

```diff
-when(() => fn(It.isString({ containing: 'foo' })).thenReturn(1);
-when(() => fn(It.isString({ matching: /bar/ })).thenReturn(2);
+when(() => fn(It.isString('foo')).thenReturn(1);
+when(() => fn(It.isString(/bar/})).thenReturn(2);
```

## `It.matches`

When you create a custom matcher with `It.matches()` you can specify how it will be printed in error messages. The method that controls this was renamed from `toJSON` to `toString`:

```diff
-const matcher = It.matches(() => true, { toJSON: () => 'custom' });
+const matcher = It.matches(() => true, { toString: () => 'custom' });
```

# Migrating to v8

## TL;DR

```diff
-import { instance, mock, when } from 'strong-mock';
+import { mock, when } from 'strong-mock';
 
 const fn = mock<(x: number) => number>();
 
-when(fn(42)).thenReturn(100);
+when(() => fn(42)).thenReturn(100);
 
-console.log(instance(fn)(42));
+console.log(fn(42));
```

## `instance`

You no longer need to use `instance` to get a stub from the mock. To accommodate this, expectations inside `when()` now have to be wrapped in a callback. The callback must return the value from the call so that the type can be properly inferred. If you want to use curly braces in the callback, don't forget the `return` statement.

```diff
-when(fn(42)).thenReturn(100);
+when(() => fn(42)).thenReturn(100);
+// Or
+when(() => { return fn(42); }).thenReturn(100);
```

```diff
-console.log(instance(fn)(42));
+console.log(fn(42));
```

If you need to migrate many tests, you can use a combination of Search+Replace and linting:

1. Replace all occurrences of `when(` with `when(() =>`.
2. Replace all occurrences of `instance(` with `(`.
3. Remove extra parentheses. You can use [Prettier](https://prettier.io/), https://typescript-eslint.io/rules/no-extra-parens/ or the `Unnecessary parentheses` code inspection in [JetBrain IDEs](https://www.jetbrains.com/help/phpstorm/javascript-and-typescript-unnecessary-parentheses.html). 
4. Remove unused imports. You can use https://www.npmjs.com/package/eslint-plugin-unused-imports or the `Optimize imports` feature in [JetBrain IDEs](https://blog.jetbrains.com/webstorm/2018/05/optimize-imports-in-webstorm/).

## Throwing on unexpected property access

strong-mock no longer throws when an unexpected property is accessed, instead returning a function that will throw when called:

```typescript
const foo = mock<{ bar: () => void }>();

// This used to throw, now doesn't.
const { bar } = myMock;

// This still throws.
bar();
```

If you want the old the behavior you can configure the `unexpectedProperty` option per mock, or globally with `setDefaults`:

```typescript
import { setDefaults, UnexpectedProperty } from 'strong-mock';

setDefaults({ unexpectedProperty: UnexpectedProperty.THROW });
```
