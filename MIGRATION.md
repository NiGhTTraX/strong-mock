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

## Syntax changes

All expectations inside `when()` now have to be wrapped in a callback. The callback must return the value from the call so that the type can be properly inferred. If you want to use curly braces in the callback, don't forget the `return` statement.

```diff
-when(fn(42)).thenReturn(100);
+when(() => fn(42)).thenReturn(100);
+// Or
+when(() => { return fn(42); }).thenReturn(100);
```

`instance` can now be removed.

```diff
-console.log(instance(fn)(42));
+console.log(fn(42));
```

If you need to migrate many tests, you can use a combination of Search+Replace and linting:

1. Replace all occurrences of `when(` with `when(() =>`.
2. Replace all occurrences of `instance(` with `(`.
3. Remove extra parentheses. You can use [Prettier](https://prettier.io/), https://typescript-eslint.io/rules/no-extra-parens/ or the `Unnecessary parentheses` code inspection in [JetBrain IDEs](https://www.jetbrains.com/help/phpstorm/javascript-and-typescript-unnecessary-parentheses.html). 
4. Remove unused imports. You can use https://www.npmjs.com/package/eslint-plugin-unused-imports or the `Optimize imports` feature in [JetBrain IDEs](https://blog.jetbrains.com/webstorm/2018/05/optimize-imports-in-webstorm/).

## Functionality changes

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
