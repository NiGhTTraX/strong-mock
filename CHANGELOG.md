# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
