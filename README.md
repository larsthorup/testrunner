# @larsthorup/testrunner

A better test runner.

```bash
npm run install:all
npm run test
```

## Scope

- [x] comparison with jest, mocha, vitest
- [x] run on windows and posix (standard)
- [x] no commonjs support (modernity)
- [x] no globals (simplicity)
- [x] external assertion library (node:assert)
- [x] do not capture output (fix)
- [x] nested describe, it (standard)
- [x] run mixed its and describes in defined order (fix)
- [x] sync and async (standard)
- [x] typed (modernity)
- [x] hooks (standard)
- [x] closures (local state)
- [x] hooks order is FILO (fix)
- [x] useSetup (fix)
- [x] useSetup composition (fix)
- [ ] external esm mocking (esmock, quibble)
- [ ] scoped mocks, use mocks in useSetup (fix)
- [ ] snapshot (via assertion library?, useLogSnapshot) (standard)
- [ ] self tested
- [ ] named hooks (fix)
- [ ] syntax for options: .skip, .todo, .concurrent, .only, .randomize, .each, .if, .unless, .fails (fix)
- [ ] describe({concurrent,serial}) - default serial - inherited (standard)
- [ ] describe({random, sequential}) - default random - inherited (catch more bugs)
- [ ] pass in test context (extensibility)
- [ ] tests in production code files (fix)
- [ ] dynamic skip, todo (fix)
- [ ] extendable timeouts (fix)
- [ ] process isolation - default off - opt-in per test (catch more bugs)
- [ ] pluggable reporting (standard)
- [ ] run in node or browser (standard)
- [ ] IDE integration
- [ ] comparison with node:test, tap, ava, junit
- [ ] compose with other module loaders
- [ ] external assertion library (chai, jest)
- [ ] external code coverage (c8)
- [ ] external watch tool (based on same --loader as the esm mocking??)
- [ ] external continuous testing (wallaby)
- [ ] external bundler (vite),
- [ ] external transpiler (typescript, jsx)
- [ ] external DOM (browser, jsdom, happy-dom)

## useSetup spec

- { before, after, get}
- { setup, teardown, get}
- useFixture
- RAII in C++ also FILO
- using
- scopes are FILO
- nestede describes??
- use cases for composing hooks (call useSetup inside a generic useX)

## Syntax for options (ideas)

- `it("should fail", {only, fails, each: [0, false]}, (value) => { assert(value); })`

  - optional second parameter
  - used by node:test
  - any order
  - surprising syntax?

- `it.only.fails.each([0, false])("should fail", (value) => { assert(value); })`
  - implementation-wise tricky to ensure any order

## ESM module mocking

- https://dev.to/giltayar/mock-all-you-want-supporting-es-modules-in-the-testdouble-js-mocking-library-3gh1
- https://www.npmjs.com/package/esmock
- https://github.com/testdouble/testdouble.js - td.replaceEsm
- https://www.npmjs.com/package/quibble
- native npm support for mocking via standard supplied --loader ??
