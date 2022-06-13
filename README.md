# @larsthorup/testrunner

A better test runner.

```bash
npm install
npm test
```

## Scope

- [x] comparison with jest, mocha, vitest
- [x] no commonjs support (modernity)
- [x] no globals (simplicity)
- [x] no console output capture (fix)

### Built-in features

- [x] run on windows and posix (standard)
- [x] nested describe, it (standard)
- [x] run mixed its and describes in defined order (fix)
- [x] sync and async (standard)
- [x] typed (modernity)
- [x] hooks - before/after all/each (standard)
- [x] closures - local state
- [x] hooks order is FILO (fix)
- [x] named hooks (fix)

### User-land features

- [x] external assertion library (node:assert)
- [x] useSetup hook (fix)
- [x] useSetup composition (fix)
- [x] external assertion library (chai)
- [x] external timer mocking (@sinonjs/fake-timers)

## TODO

- [ ] export types for use in user land, like Fn for useSetup
- [ ] external timeout handling - https://github.com/lukeed/uvu/issues/33
- [ ] external method mocking (sinon, testdouble)
- [ ] external esm mocking (import map, esmock (node only))
- [ ] scoped mocks, use mocks in useSetup (node only) (fix)
- [ ] snapshot (via assertion library?, useLogSnapshot) (standard)
- [ ] self tested
- [ ] syntax for options: .skip, .todo, .concurrent, .only, .randomize, .each, .if, .unless, .fails (fix)
- [ ] black list file with test name pattern and option (eg: `[BUG-123] - fails`) for bug tracker integration for "open" issues
- [ ] describe({concurrent,serial}) - default serial - inherited (standard)
- [ ] describe({random, sequential}) - default random - inherited (catch more bugs)
- [ ] test file order - random/sorted + concurrent/serial
- [ ] pass in test context (extensibility)
- [ ] tests in production code files (fix)
- [ ] dynamic skip, todo (fix)
- [ ] configurable test file set (standard)
- [ ] extendable timeouts (fix)
- [ ] test isolation - default off - opt-in per test (catch more bugs)
- [ ] pluggable reporting (standard)
- [ ] run in node or browser (standard)
- [ ] IDE integration
- [ ] comparison with uvu, node:test, tap, ava, junit
- [ ] compose with other module loaders
- [ ] external snapshot matcher (unexpected-snapshot, chai-jest-snapshot)
- [ ] external code coverage (c8)
- [ ] external differential code coverage (https://github.com/romeovs/lcov-reporter-action#lcov-base-optional)
- [ ] external timing spike alert / trend chart generator
- [ ] external watch tool (based on same --loader as the esm mocking??)
- [ ] external continuous testing (wallaby)
- [ ] external bundler (vite),
- [ ] external transpiler (typescript, jsx)
- [ ] external DOM (browser, jsdom, happy-dom)
- [ ] external sequence diagram generation tool (bestbrains/projects/commons-dotnet-bestbrains/System/SequenceDiagram.cs)

## Syntax for options (ideas)

- `it("should fail", {only, fails, each: [0, false]}, (value) => { assert(value); })`

  - optional second parameter
  - used by node:test
  - any order
  - surprising syntax?

- `it.only.fails.each([0, false])("should fail", (value) => { assert(value); })`
  - implementation-wise tricky to ensure any order

## ESM module mocking in Node

- https://dev.to/giltayar/mock-all-you-want-supporting-es-modules-in-the-testdouble-js-mocking-library-3gh1
- https://www.npmjs.com/package/esmock
- https://github.com/testdouble/testdouble.js - td.replaceEsm
- https://www.npmjs.com/package/quibble
- native npm support for mocking via standard supplied --loader ??

## ESM module mocking in browser

- https://javascript.plainenglish.io/testing-and-mocking-javascript-modules-in-browser-ae9fc333ee5d
