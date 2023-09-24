# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [9.0.0-beta.0](https://github.com/NiGhTTraX/strong-mock/compare/v8.0.1...v9.0.0-beta.0) (2023-09-24)


### ⚠ BREAKING CHANGES

* Merge `isString`'s optional `containing` and `matching` args
* Rename the `toJSON` matcher method to `toString`
* `isObject` now correctly fails for `null` and `undefined`

### Features

* Attach actual/expected args to error instance to enable IDE diffs ([7a04a43](https://github.com/NiGhTTraX/strong-mock/commit/7a04a43b47471f2178595a98dec2975e0cf7249e))
* Improve `isArray` diff ([a5aaddd](https://github.com/NiGhTTraX/strong-mock/commit/a5aaddd0a28108dd82d204914b1b5f00a6ac9cca))
* Improve `isNumber` diff ([55647ed](https://github.com/NiGhTTraX/strong-mock/commit/55647ed698323be9008b0e517b405df85299b12c))
* Improve `isObject` diff ([5533bcf](https://github.com/NiGhTTraX/strong-mock/commit/5533bcf6fef6b1275b9ab64c1caf0b6235e1628c))
* Improve `isString` diff ([5c73fbb](https://github.com/NiGhTTraX/strong-mock/commit/5c73fbbe339753bc1838d7e401af14828b8fc070))
* Improve `willCapture` diff ([7d92ce9](https://github.com/NiGhTTraX/strong-mock/commit/7d92ce9ef67cd44aca5707cbf4f268b26605c983))
* Improve colors in UnexpectedCall error message ([f326954](https://github.com/NiGhTTraX/strong-mock/commit/f326954d4284a65ed87794f567accc4875561988))
* Pretty print argument diffs in UnexpectedCall error messages ([ba4f6b5](https://github.com/NiGhTTraX/strong-mock/commit/ba4f6b5df5845fccce78373a509be73fbb9d8aca))


### Bug Fixes

* `isObject` now correctly fails for `null` and `undefined` ([9b50fe4](https://github.com/NiGhTTraX/strong-mock/commit/9b50fe48caeaafc5036085db596204a362795e3b))
* Fix `It` docstrings ([df7f91a](https://github.com/NiGhTTraX/strong-mock/commit/df7f91a3f3f991894470c8ca759b069d82819fa0))
* Handle non string keys in `isObject` ([87cb768](https://github.com/NiGhTTraX/strong-mock/commit/87cb7684ad248e2761195963f8f69857a5124cbd))


* Merge `isString`'s optional `containing` and `matching` args ([f53a05e](https://github.com/NiGhTTraX/strong-mock/commit/f53a05e5ba691f1f6b409f6b5c5e1ac508a39c1f))
* Rename the `toJSON` matcher method to `toString` ([95ffd6b](https://github.com/NiGhTTraX/strong-mock/commit/95ffd6b6030748cb509d8cef7317b891cb5a8250))

### [8.0.1](https://github.com/NiGhTTraX/strong-mock/compare/v8.0.0...v8.0.1) (2023-01-18)


### Bug Fixes

* Allow mocks to be inside Promises ([3144722](https://github.com/NiGhTTraX/strong-mock/commit/3144722d45b2a298920d37a756168ac56779fb2b)), closes [#321](https://github.com/NiGhTTraX/strong-mock/issues/321)
* **deps:** update dependency jest-matcher-utils to ~29.3.0 ([929d16e](https://github.com/NiGhTTraX/strong-mock/commit/929d16e7d1ee6bd9ecbae1f863459a629067891a))

## [8.0.0](https://github.com/NiGhTTraX/strong-mock/compare/v8.0.0-beta.2...v8.0.0) (2022-10-02)

This is a major release with many new features, some breaking changes, and a lot of changes under the hood. See the [migration guide](MIGRATION.md).

### ⚠ BREAKING CHANGES

* You no longer have to remember to call `instance`
  before passing the mock to the code under test, because we removed it!
  The object returned by `mock()` can now be passed directly to your code.
* Expectations now have to be wrapped in a callback
  inside `when`. This change is necessary to remove the `instance`
  function.
* The default matcher option previously available only in
  `setDefaults` has been renamed to `concreteMatcher`.
* The default behavior now avoids immediately throwing
  on unexpected property access. This should lead to improved error
  messages, and less breaking on common code patterns e.g. destructuring. You can configure this with the `unexpectedProperty` option.
* You can no longer pass a custom expectation repository
  or a custom expectation factory to the `mock()` function. These options
  weren't documented very well and just bloated the API.

### Features

* Add `exactParams` option ([31acbbe](https://github.com/NiGhTTraX/strong-mock/commit/31acbbec7601d136e8b3860ba04868a633551b21))
* Add `unexpectedProperty` option
* Allow concrete matcher to be configured for each mock ([32c82ba](https://github.com/NiGhTTraX/strong-mock/commit/32c82baa1afab573d8a3dcdf1f2543fe5d56fc0a))

### Bug Fixes

* Don't treat `any` returns as promises ([9304492](https://github.com/NiGhTTraX/strong-mock/commit/93044921e1717a571fbb298b9adfcdba6c3b03c9))

## [8.0.0-beta.2](https://github.com/NiGhTTraX/strong-mock/compare/v8.0.0-beta.1...v8.0.0-beta.2) (2022-09-26)


### ⚠ BREAKING CHANGES

* The `strictness` option has been renamed to
`unexpectedProperty` to better illustrate its intent.

### Features

* Add `exactParams` option ([31acbbe](https://github.com/NiGhTTraX/strong-mock/commit/31acbbec7601d136e8b3860ba04868a633551b21))


### Bug Fixes

* **deps:** update dependency jest-matcher-utils to v28 ([33fe92a](https://github.com/NiGhTTraX/strong-mock/commit/33fe92aef8e8f1d0d0db25f7eca6deec13ddbc8d))
* Don't treat `any` returns as promises ([9304492](https://github.com/NiGhTTraX/strong-mock/commit/93044921e1717a571fbb298b9adfcdba6c3b03c9))


* Rename option ([db9cc06](https://github.com/NiGhTTraX/strong-mock/commit/db9cc06f266f2900bfbf96737518d55b3b8536c7))

## [8.0.0-beta.1](https://github.com/NiGhTTraX/strong-mock/compare/v8.0.0-beta.0...v8.0.0-beta.1) (2022-08-18)


### ⚠ BREAKING CHANGES

* The default matcher option previously available only in
`setDefaults` has been renamed to `concreteMatcher`.
* The default strictness now avoids immediately throwing
on unexpected property access. This should lead to improved error
messages, and less breaking on common code patterns e.g. destructuring.

If you want the old behavior use:

```
import { setDefaults, Strictness } from 'strong-mock';

setDefaults({ strictness: Strictness.SUPER_STRICT });
```
* You can no longer pass a custom expectation repository
or a custom expectation factory to the `mock()` function. These options
weren't documented very well and just bloated the API.

### Features

* `verify` and `verifyAll` now respect the strictness option ([c93c7be](https://github.com/NiGhTTraX/strong-mock/commit/c93c7becbf0a22391f56600a85137a0cfc4be367))
* Add strictness option to improve unexpected call errors ([71bb975](https://github.com/NiGhTTraX/strong-mock/commit/71bb975e1af9a5b748303a07a90dd43e03fc96fd))
* Allow concrete matcher to be configured for each mock ([32c82ba](https://github.com/NiGhTTraX/strong-mock/commit/32c82baa1afab573d8a3dcdf1f2543fe5d56fc0a))
* Allow strictness to be configured for each mock ([c34bacc](https://github.com/NiGhTTraX/strong-mock/commit/c34baccef154a8f868a65048561c4ef4d37ba705))
* Control mock strictness through setDefaults ([6590713](https://github.com/NiGhTTraX/strong-mock/commit/6590713c91be1b278bc060f543ec514b17c2fedf))


### Bug Fixes

* Don't record property call stats for function calls ([de204a5](https://github.com/NiGhTTraX/strong-mock/commit/de204a5cb91325bf317195339a77133a4fed4af5))
* Print callback syntax in expectation error message ([0bf9633](https://github.com/NiGhTTraX/strong-mock/commit/0bf9633c10b0c7c8260d637f4b66be6b8af15d90))


* Remove mock options ([8bf2d2d](https://github.com/NiGhTTraX/strong-mock/commit/8bf2d2d09bde714df73bda79240a7a1774ca067f))

## [8.0.0-beta.0](https://github.com/NiGhTTraX/strong-mock/compare/v7.3.0...v8.0.0-beta.0) (2022-07-15)


### ⚠ BREAKING CHANGES

* You no longer have to remember to call `instance`
before passing the mock to the code under test, because we removed it!
The object returned by `mock()` can now be passed directly to your code.
* Expectations now have to be wrapped in a callback
inside `when`. This change is necessary to remove the `instance`
function. Before: `when(foo.bar())`. After: `when(() => foo.bar())`.

### Bug Fixes

* **deps:** update dependency jest-matcher-utils to ~27.3.0 ([a287174](https://github.com/NiGhTTraX/strong-mock/commit/a28717432dd07d67242d32caeca80c7e8bd0c427))
* **deps:** update dependency jest-matcher-utils to ~27.4.0 ([133a17d](https://github.com/NiGhTTraX/strong-mock/commit/133a17d2684bbc1135764fd2ad67afb7e16034c8))


* Remove `instance` ([dc2338d](https://github.com/NiGhTTraX/strong-mock/commit/dc2338d36f74e9383934bc5cf07f0ca6fc7e9096))
* Require callback when setting expectations ([b0e46f4](https://github.com/NiGhTTraX/strong-mock/commit/b0e46f48bb28c37e87f5d9534c15f06324f308b3))

## [7.3.0](https://github.com/NiGhTTraX/strong-mock/compare/v7.2.1...v7.3.0) (2021-09-26)


### Features

* Add `It.is` matcher ([d0e89b2](https://github.com/NiGhTTraX/strong-mock/commit/d0e89b216b2160d40b7b9334788ca19aed68f468)), closes [#252](https://github.com/NiGhTTraX/strong-mock/issues/252)
* Add `strict` option to `deepEquals` matcher ([c98ea56](https://github.com/NiGhTTraX/strong-mock/commit/c98ea56c2eddb30df7d133a56cb37ac89154c608)), closes [#252](https://github.com/NiGhTTraX/strong-mock/issues/252) [#257](https://github.com/NiGhTTraX/strong-mock/issues/257)
* Allow overriding the default matcher ([e5d27c8](https://github.com/NiGhTTraX/strong-mock/commit/e5d27c87d99d3690d47bf553551acf95d39bd07a)), closes [#252](https://github.com/NiGhTTraX/strong-mock/issues/252)
* Expose default `deepEquals` matcher ([7d1d015](https://github.com/NiGhTTraX/strong-mock/commit/7d1d01500344a67a3bcc06ba28c93a8b9c9b077b))


### Bug Fixes

* **deps:** update dependency jest-matcher-utils to ~27.2.0 ([8a68c86](https://github.com/NiGhTTraX/strong-mock/commit/8a68c86ea6c630818d0f1b05e79c08d23fbbe350))

### [7.2.1](https://github.com/NiGhTTraX/strong-mock/compare/v7.2.0...v7.2.1) (2021-09-08)


### Bug Fixes

* Make `instance` referentially stable ([4194526](https://github.com/NiGhTTraX/strong-mock/commit/41945264343024039e89b8a0dedcf8f3ba87209a))

## [7.2.0](https://github.com/NiGhTTraX/strong-mock/compare/v7.1.2...v7.2.0) (2021-09-06)


### Features

* Add `It.willCapture` ([987e391](https://github.com/NiGhTTraX/strong-mock/commit/987e3910db4abbce4ca4b65e3c54c32191e30ddd))

### [7.1.2](https://github.com/NiGhTTraX/strong-mock/compare/v7.1.1...v7.1.2) (2021-08-28)


### Bug Fixes

* Allow other strong mocks in expectations ([569815b](https://github.com/NiGhTTraX/strong-mock/commit/569815b26acaff178dab70602ad705e07f352185)), closes [#254](https://github.com/NiGhTTraX/strong-mock/issues/254) [#256](https://github.com/NiGhTTraX/strong-mock/issues/256)
* **deps:** update dependency jest-matcher-utils to ~27.1.0 ([b024ed0](https://github.com/NiGhTTraX/strong-mock/commit/b024ed00ba11d39bc1195a971285136f443a719d))

### [7.1.1](https://github.com/NiGhTTraX/strong-mock/compare/v7.1.0...v7.1.1) (2021-08-26)

## [7.1.0](https://github.com/NiGhTTraX/strong-mock/compare/v7.0.0...v7.1.0) (2021-06-24)


### Features

* `thenReject` now lazily creates promise rejection ([01c9995](https://github.com/NiGhTTraX/strong-mock/commit/01c9995c69d00205388da6d7dba2b35d9e70e5b8)), closes [#238](https://github.com/NiGhTTraX/strong-mock/issues/238)


### Bug Fixes

* Correctly throw error values from method expectations ([a1ad324](https://github.com/NiGhTTraX/strong-mock/commit/a1ad3244f8dfe7ed1e93193479e5cd347f2bf348))

## [7.0.0](https://github.com/NiGhTTraX/strong-mock/compare/v6.0.0...v7.0.0) (2021-06-17)


### ⚠ BREAKING CHANGES

* Node 10 is no longer supported.

### Features

* Allow mock instances to be enumerable ([850223c](https://github.com/NiGhTTraX/strong-mock/commit/850223cbd906297f07923883c554589b5d12ed53)), closes [#235](https://github.com/NiGhTTraX/strong-mock/issues/235)
* Print promise values in error messages ([bc0301f](https://github.com/NiGhTTraX/strong-mock/commit/bc0301f983147d738af657ae285f696cbfa497e3))


### Bug Fixes

* **deps:** update dependency jest-matcher-utils to ~26.2.0 ([52e9740](https://github.com/NiGhTTraX/strong-mock/commit/52e9740420bf0479e16f00d9f179e99714ae58fd))
* **deps:** update dependency jest-matcher-utils to ~26.3.0 ([b7f483b](https://github.com/NiGhTTraX/strong-mock/commit/b7f483b8e9b3ed4585a81c3a401f7501691e38ad))
* **deps:** update dependency jest-matcher-utils to ~26.4.0 ([3fe4f66](https://github.com/NiGhTTraX/strong-mock/commit/3fe4f663388724dafaa6813fd8ac02e8a0db6960))
* **deps:** update dependency jest-matcher-utils to ~26.5.0 ([b496bcf](https://github.com/NiGhTTraX/strong-mock/commit/b496bcf1386d1586472f6c15f9a6b8be62dc472c))
* **deps:** update dependency jest-matcher-utils to ~26.6.0 ([7e25d8c](https://github.com/NiGhTTraX/strong-mock/commit/7e25d8c84a19b0f1fa06c6d003d3c0a137b8928b))
* **deps:** update dependency jest-matcher-utils to v27 ([ed3740b](https://github.com/NiGhTTraX/strong-mock/commit/ed3740b47247267f21ce1cc6df2b3cf01df5a019))
* **deps:** update dependency lodash to ~4.17.0 ([8c192bc](https://github.com/NiGhTTraX/strong-mock/commit/8c192bc79df3af4400445949eca307d86aafb8f7))


### build

* Use node 12 ([d30054a](https://github.com/NiGhTTraX/strong-mock/commit/d30054aa2eee48f612737e3d747022c57694d219))

## [6.0.0](https://github.com/NiGhTTraX/strong-mock/compare/v5.0.1...v6.0.0) (2020-06-27)


### ⚠ BREAKING CHANGES

* Rename `isObjectContaining` to `isObject`

### Features

* Add isNumber matcher ([cc5b0a8](https://github.com/NiGhTTraX/strong-mock/commit/cc5b0a8d125c3632f6c6610381b4fc78b8994f7f))
* Add isString ([6d5980f](https://github.com/NiGhTTraX/strong-mock/commit/6d5980fc82479c6a5bc02068e33a2d5ae9b34fda))
* Add It.isArray ([2359b43](https://github.com/NiGhTTraX/strong-mock/commit/2359b43206aa6bbb20e18295ae332700f0f8a3c8))
* Add verifyAll and resetAll ([eef45e0](https://github.com/NiGhTTraX/strong-mock/commit/eef45e054f6818f629b4fcd17673e6323c025c26))
* Improve error message when setting expectation on nested property ([f1ebabe](https://github.com/NiGhTTraX/strong-mock/commit/f1ebabe29cc5388a04c8183c29b205b38d75cf1a))
* Make matching any object easier ([6011775](https://github.com/NiGhTTraX/strong-mock/commit/60117752e8e0a21ff7df4d2dc2daf05b7b94d0c1))
* Support nested matchers ([c3157b1](https://github.com/NiGhTTraX/strong-mock/commit/c3157b1ce9e6b1761a4f3377885ff195c077f9d0))


### Bug Fixes

* **deps:** update dependency jest-matcher-utils to ~26.1.0 ([7884b7d](https://github.com/NiGhTTraX/strong-mock/commit/7884b7da0871a7a9e8855a328bd05d97546cf162))
* Make isNumber pretty print consistently with other matchers ([bc5f4f8](https://github.com/NiGhTTraX/strong-mock/commit/bc5f4f86855d9090e82f3f13e323a17ff795ec71))
* Make isString pretty print consistently with other matchers ([3b6d9e8](https://github.com/NiGhTTraX/strong-mock/commit/3b6d9e8b0fff14ca43542d267f1f95878adc3f6b))
* Make mocks pretty-format-able ([73200db](https://github.com/NiGhTTraX/strong-mock/commit/73200dbadc8d5a90b8541fcf7394abd343f6dfd8))

### [5.0.1](https://github.com/NiGhTTraX/strong-mock/compare/v5.0.0...v5.0.1) (2020-05-07)


### Bug Fixes

* Clear unexpected calls on `reset()` ([04493f7](https://github.com/NiGhTTraX/strong-mock/commit/04493f7fa7c0814a4a64aaa4671696df57cb2929))

## [5.0.0](https://github.com/NiGhTTraX/strong-mock/compare/v5.0.0-beta.1...v5.0.0) (2020-05-07)


### Features

* Improve error message for `UnexpectedCalls` ([ff8636c](https://github.com/NiGhTTraX/strong-mock/commit/ff8636c871a45a869d2d509120b40914887f554b))

## [5.0.0-beta.1](https://github.com/NiGhTTraX/strong-mock/compare/v5.0.0-beta.0...v5.0.0-beta.1) (2020-05-05)


### Bug Fixes

* Don't mark toString accesses as unexpected ([20247b6](https://github.com/NiGhTTraX/strong-mock/commit/20247b6799f55fda32d72620e5b8571be323ce99))

## [5.0.0-beta.0](https://github.com/NiGhTTraX/strong-mock/compare/v4.1.3...v5.0.0-beta.0) (2020-05-05)


### ⚠ BREAKING CHANGES

* `verify` used to rely on unexpected calls throwing
when they were made. However, the code under test could `try..catch`
that error and never bubble it up to the test. Unless the test
explicitly checked that the SUT was not in an error state, `verify`
would have not been enough to make sure that everything was correct.
Now it throws if any unexpected calls happened.

### Features

* Record unexpected calls ([a87f612](https://github.com/NiGhTTraX/strong-mock/commit/a87f612df7e702e980f1f3271a8585ac6a280c67))
* Throw on unexpected calls when verifying mock ([f68e2f2](https://github.com/NiGhTTraX/strong-mock/commit/f68e2f231f29a5f97c93011241a1f312e8c6f247))


### Bug Fixes

* **deps:** update dependency jest-matcher-utils to v26 ([5ae654d](https://github.com/NiGhTTraX/strong-mock/commit/5ae654d31205bc554a7f9edae4dd8a5a45b77cc7))
