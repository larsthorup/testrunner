# @larsthorup/testrunner

How to build a minimalistic test runner.

Requirements:

- Node.js
- Bash

```bash
npm install
npm test
```

## Scope

- [x] comparison with jest, mocha, vitest, playwright
- [x] no commonjs support (modernity)
- [x] no globals (simplicity)
- [x] no console output capture (fix)
- [x] performance, verify with https://github.com/EvHaus/test-runner-benchmarks

### Built-in standard features

- [x] cross-platform: run on windows and posix (standard)
- [x] suites: nested describe, it (standard)
- [x] sync and async (standard)
- [x] typed (modernity)
- [x] hooks: before/after all/each (standard)
- [x] closures for local state (standard)
- [x] exit code: number of failing tests (standard)
- [x] configurable test file list (standard)
- [x] run test files concurrently - with worker_threads (standard)

### Built-in fixes

- [x] run mixed its and describes in defined order (fix)
- [x] hooks order is FILO (fix)
- [x] named hooks (fix)
- [x] dynamic skip (IgnoreError) (fix)

### User-land fixes

- [x] external useSetup hook (fix)
- [x] external useSetup composition (fix)
- [x] external fails handling (fix)
- [x] external timeout handling (fix)
- [x] extensible syntactic sugar .skip, timeout (fix)
- [x] external support having tests in production code files (fix)

### User-land features

- [x] external assertion library (node:assert, chai)
- [x] external timer mocking (@sinonjs/fake-timers)
- [x] external each (standard)
- [x] external object mocking (tinyspy)
- [x] external jest compatibility matchers for chai expect: toHaveLength, toBe, toEqual (standard)
- [x] external shareable module mocks: (esmock)
- [x] external test file discovery (glob)
- [x] external watch for re-testing (esm-tracer)
- [x] external coverage (c8)
- [x] external transpiler (tsc)
- [x] external reporter (standard)
- [x] `debugger;` support: `ndb node packages/testrunner/src/cli.js packages/demo/examples/src/example.test.js`
- [x] external dom mocking (happy-dom)
- [x] external skip and only handling with plugins (standard)
- [x] external type matchers (@humeris/espresso-shot)

### Hopefully user-land features

- [ ] node or browser
- [ ] shard across multiple machines

## Pipeline for watch and transpile

- [ ] source files are changed (by user, by git pull)
- [ ] transpilation watcher transpiles files
- [ ] coverage instrumentation watcher instruments files
- [ ] watcher searches for new instrumented files
- [ ] dependency impact test file discovery selects test files impacted by updated dependencies
- [ ] test runner is invoked and given the selected test files
- [ ] coverage report is saved from the run
- [ ] dependency impact is updated from the run

## TODO

- [ ] fix: make "only" work across multiple files
- [ ] fix: make "only" run all hooks (Collapsible test)
- [ ] extract change-impact-plugin
- [ ] chores: unit tests, clean code, remove TODOs
- [ ] pass in test context: {name, signal, timeout} (extensibility, standard)
- [ ] dom preview like vitest-preview
- [ ] have a test that repeats runnning all tests in parallel 100 times
- [ ] verify that esmock is concurrency safe
- [ ] suite scoped fixtures (per describe block)
- [ ] API: timeout: test.setTimeout / test.addTimeout: a la playwright
- [ ] external reporters (jest, mocha, vitest, IDE)
- [ ] sensible concurrency defaults: inside file: sequential, files: concurrently
- [ ] concurrency api: a la playwright?
- [ ] design: extensible filtering: title pattern, only, impacted by change
- [ ] design: extensible ordering: concurrent/sequential, random/source/sorted
- [ ] design: extensible sharding across multiple machines
- [ ] useSetup: pass-in beforeAll/beforeEach (so implementation in vitest is possible) - seems clumsy
- [ ] useSetup: explicit dependencies to guard against concurrent execution
- [ ] extendable timeouts (fix)
- [ ] scoped mocks, use mocks in useSetup (node only) (fix)
- [ ] snapshot (via assertion library?, useLogSnapshot) (standard)
- [ ] self tested
- [ ] syntax for options: .skip, .todo, .concurrent, .only, .randomize, .each, .if, .unless, .fails (fix)
- [ ] black list file with test name pattern and option (eg: `[BUG-123] - fails`) for bug tracker integration for "open" issues
- [ ] describe({concurrent,serial}) - default serial - inherited (standard)
- [ ] describe({random, sequential}) - default random - inherited (catch more bugs)
- [ ] isolation / concurrency via worker threads (node), web workers (browser), browser tabs?
- [ ] test file order - random/sorted + concurrent/serial
- [ ] test isolation - default off - opt-in per test (catch more bugs)
- [ ] run in node or browser (standard)
- [ ] IDE integration
- [ ] comparison with uvu, node:test, tap, ava, junit, nunit
- [ ] external object mocking (sinon, testdouble)
- [ ] compose with other module loaders
- [ ] external module mocking (import map (browser))
- [ ] external snapshot matcher (unexpected-snapshot, chai-jest-snapshot)
- [ ] external differential code coverage (https://github.com/romeovs/lcov-reporter-action#lcov-base-optional)
- [ ] external timing spike alert / trend chart generator (reporter)
- [ ] external continuous testing (wallaby)
- [ ] external bundler (vite),
- [ ] external DOM (browser, jsdom, happy-dom)
- [ ] external sequence diagram generation tool (bestbrains/projects/commons-dotnet-bestbrains/System/SequenceDiagram.cs)

## Inspiration

- [ ] https://www.npmjs.com/package/sxy-test-runner (uses babel for parsing dependencies)

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

## watch mode using esm loader to track dependencies

- [x] do not write a file - keep in memory - pass deps from worker
- [x] collect all test files
- [x] run selected tests
- [x] trace deps per test
- [x] deps tracer should run AFTER esmock, so that mocked dependencies are used instead of real dependencies
- [x] save deps per test file
- [x] discover impacted files since last check
  - [x] discover test files
  - [x] read last file change time
  - [x] read deps for test files
  - [x] create impact map from dep file to test file
  - [x] discover file change time of deps
  - [x] filter test files impacted by changed deps
  - [x] record last file change time
  - [x] use watcher event to avoid testing every file change time
- [ ] loop back to run selected tests
