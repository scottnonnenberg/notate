# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="1.0.0"></a>
# [1.0.0](https://github.com/scottnonnenberg/notate/compare/v0.2.0...v1.0.0) (2016-06-27)


### Bug Fixes

* **browsers:** use better cross-browser function type check  ([7af0f5a](https://github.com/scottnonnenberg/notate/commit/7af0f5a))
* **prettyPrint:** Expand try/catch coverage for more reliability ([4a0e7bb](https://github.com/scottnonnenberg/notate/commit/4a0e7bb))
* **sauce-platforms:** Better formatting of text and JSON output ([d5c5faf](https://github.com/scottnonnenberg/notate/commit/d5c5faf))
* **sauce-platforms:** Update available sauce platforms ([b76ba8c](https://github.com/scottnonnenberg/notate/commit/b76ba8c))
* **sauce-tests:** Proper interruption of run, handle failed test runs ([927bb04](https://github.com/scottnonnenberg/notate/commit/927bb04))
* **scripts:** Sauce platforms script displays properly once more ([96deb63](https://github.com/scottnonnenberg/notate/commit/96deb63))


### Features

* **annotation:** move to **notate instead of **breadcrumb for prefix ([a6813e1](https://github.com/scottnonnenberg/notate/commit/a6813e1))
* **API:** add notate function as a named export (duplicates default) ([c28eb30](https://github.com/scottnonnenberg/notate/commit/c28eb30))
* **es2015-loose:** Use babel's loose mode, so IE8 doesn't crash on load ([406ab84](https://github.com/scottnonnenberg/notate/commit/406ab84))
* **es3ify:** strip problematic keywords with webpack loader for IE8/9 ([3503d3f](https://github.com/scottnonnenberg/notate/commit/3503d3f))
* **exports:** Export something that works for CommonJS ([d679132](https://github.com/scottnonnenberg/notate/commit/d679132))
* **IE:** add bullet-proofing and fixes for internet explorer ([08682ea](https://github.com/scottnonnenberg/notate/commit/08682ea))
* **maxLines:** prettyPrint() takes second options param, maxLines key ([42f51a7](https://github.com/scottnonnenberg/notate/commit/42f51a7))
* **merge:** find key not already taken when merging - no lost data! ([f54e9ab](https://github.com/scottnonnenberg/notate/commit/f54e9ab))
* **node-v6:** normalize output on node v6, so it matches v4 and below ([1c2b768](https://github.com/scottnonnenberg/notate/commit/1c2b768))
* **parameters:** cb parameter first, must be fn; new: justNotate() ([1fd7e24](https://github.com/scottnonnenberg/notate/commit/1fd7e24))


### BREAKING CHANGES

* parameters: now `notate(cb, err, data)` instead of 
`notate(err, cb, data`. Also, cb is required unless you are using
`justNotate(err, data)`.
* exports: if you were using CommonJS before, the primary function was at `.default`. Now it will be exactly what is returned from `require()`.



<a name="0.2.0"></a>
# [0.2.0](https://github.com/scottnonnenberg/notate/compare/v0.1.0...v0.2.0) (2016-06-13)


### Features

* **license:** Officially open-source this project with MIT license ([ca971e5](https://github.com/scottnonnenberg/notate/commit/ca971e5))
* **name:** Move to scoped name ([bd8364d](https://github.com/scottnonnenberg/notate/commit/bd8364d))
* **readme:** Add initial readme version ([c3b4609](https://github.com/scottnonnenberg/notate/commit/c3b4609))

<a name="0.1.0"></a>
# 0.1.0 (2016-04-12)

* First functional version of project: quite a few browsers supported, all ES2015
* Adapted from `Breadcrumbs` feature of `thehelp-core`: https://github.com/thehelp/core/blob/master/src/both/thehelp-core/breadcrumbs.js
