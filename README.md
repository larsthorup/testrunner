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
- [x] closures - local state (standard)
- [x] hooks order is FILO (fix)
- [x] named hooks (fix)
- [x] dynamic skip, todo (IgnoreError) (fix)
- [x] exit code: number of failing tests (standard)
- [x] configurable test file set (standard)

### User-land features

- [x] external assertion library (node:assert, chai)
- [x] external useSetup hook (fix)
- [x] external useSetup composition (fix)
- [x] external timer mocking (@sinonjs/fake-timers)
- [x] external fails handling (fix)
- [x] external timeout handling (fix)
- [x] extensible syntactic sugar .skip, .todo, timeout (fix)
- [x] external each (standard)
- [x] external support having tests in production code files (fix)

## TODO

- [ ] extract examples/src/lib into @larsthorup/testutils package
- [ ] external object mocking (tinyspy, sinon, testdouble)
- [ ] external module mocking (import map, esmock (node only))
- [ ] pass in test context (extensibility)
- [ ] design: extensible discovery: file glob
- [ ] design: extensible filtering: title pattern, only
- [ ] design: extensible ordering: concurrent/serial, random/sequential/sorted
- [ ] extendable timeouts (fix)
- [ ] scoped mocks, use mocks in useSetup (node only) (fix)
- [ ] snapshot (via assertion library?, useLogSnapshot) (standard)
- [ ] self tested
- [ ] syntax for options: .skip, .todo, .concurrent, .only, .randomize, .each, .if, .unless, .fails (fix)
- [ ] black list file with test name pattern and option (eg: `[BUG-123] - fails`) for bug tracker integration for "open" issues
- [ ] describe({concurrent,serial}) - default serial - inherited (standard)
- [ ] describe({random, sequential}) - default random - inherited (catch more bugs)
- [ ] test file order - random/sorted + concurrent/serial
- [ ] test isolation - default off - opt-in per test (catch more bugs)
- [ ] external reporters (jest, mocha, vitest)
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

- `it("should fail", {only, fails, each: [0, false], timeout: 5000}, (ctx, value) => { assert(value); })`
  - optional second parameter
  - used by node:test
  - any order
  - surprising syntax?
- `it("should fail", [only, fails, each[0, false], timeout(5000)], (ctx) => { assert(ctx.arg); })})
  - user land options?
- `it.only.fails.each([0, false])("should fail", (ctx) => { assert(ctx.arg); }, { timeout: 5000})`
  - implementation-wise tricky to ensure any order
  - typing of ctx.arg

## ESM module mocking in Node

- https://dev.to/giltayar/mock-all-you-want-supporting-es-modules-in-the-testdouble-js-mocking-library-3gh1
- https://www.npmjs.com/package/esmock
- https://github.com/testdouble/testdouble.js - td.replaceEsm
- https://www.npmjs.com/package/quibble
- native npm support for mocking via standard supplied --loader ??

## ESM module mocking in browser

- https://javascript.plainenglish.io/testing-and-mocking-javascript-modules-in-browser-ae9fc333ee5d
