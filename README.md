# @larsthorup/testrunner

How to build a test runner.

```bash
npm install
npm test
```

## Scope

- [x] comparison with jest, mocha, vitest, playwright
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
- [x] run test files concurrently - with tinypool

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
- [x] external object mocking (tinyspy)
- [x] jest matcher for chai expect: toHaveLength, toBe, toEqual (standard)
- [x] external module mocking (esmock (node only)) (standard)
- [x] esmock: how to share mocks between tests (not inlined)
- [x] esmock: how to mock deeper deps

## TODO

- [ ] external watch tool (using node esm loader to track deps)
- [ ] have a test that repeats runnning all tests in parallel 100 times
- [ ] performance, verify with tinybench and https://github.com/EvHaus/test-runner-benchmarks
- [ ] verify that esmock is concurrency safe
- [ ] typed matchers https://www.npmjs.com/package/@humeris/espresso-shot
- [ ] suite scoped fixtures (per describe block)
- [ ] API: timeout: test.setTimeout / test.addTimeout: a la playwright
- [ ] sensible concurrency defaults: inside file: sequential, files: concurrently
- [ ] concurrency api: a la playwright?
- [ ] pass in test context (extensibility)
- [ ] design: extensible discovery: file glob
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
- [ ] external reporters (jest, mocha, vitest, IDE)
- [ ] run in node or browser (standard)
- [ ] IDE integration
- [ ] comparison with uvu, node:test, tap, ava, junit, nunit
- [ ] external object mocking (sinon, testdouble)
- [ ] compose with other module loaders
- [ ] external code coverage (c8)
- [ ] external module mocking (import map (browser))
- [ ] external snapshot matcher (unexpected-snapshot, chai-jest-snapshot)
- [ ] external differential code coverage (https://github.com/romeovs/lcov-reporter-action#lcov-base-optional)
- [ ] external timing spike alert / trend chart generator
- [ ] external continuous testing (wallaby)
- [ ] external bundler (vite),
- [ ] external transpiler (typescript, jsx)
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

- do not write a file - keep in memory - pass deps from worker
- collect all test files
- run all tests
- [x] generate deps per test
- watch file system for changes, including new test files
- select tests impacted by changes via dependency tree
  - B.isLoadedBy = []
  - A.isLoading.each(B => B.isLoadedBy.push(A))
  - isLoadedBy visitor, collect leaf nodes
- run selected tests
- update dependency tree
  - A calls B
  - A is loaded - A.isLoading = []
  - B is loaded by A - A.isLoading.push(B)
- loop back to watch
- [x] deps loader should run AFTER esmock, so that mocked dependencies are used instead of real dependencies
