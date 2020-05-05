# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
