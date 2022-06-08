# @larsthorup/testrunner

A better test runner.

```bash
npm run install:all
npm run test
```

## Scope

- [x] comparison with mocha, vitest
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
- [ ] self tested
- [ ] syntax for options: .skip, .todo, .concurrent, .only, .randomize, .each, .if, .unless, .fails (fix)
- [ ] describe({concurrent,serial}) - default serial - inherited (standard)
- [ ] describe({random, sequential}) - default random - inherited (catch more bugs)
- [ ] named hooks (fix)
- [ ] pass in test context (extensibility)
- [ ] tests in production code files (fix)
- [ ] dynamic skip, todo (fix)
- [ ] extendable timeouts (fix)
- [ ] process isolation - default off - opt-in per test (catch more bugs)
- [ ] pluggable reporting (standard)
- [ ] run in node or browser (standard)
- [ ] run on windows and posix (standard)
- [ ] IDE integration
- [ ] comparison with node:test, jest, tap, ava, junit
- [ ] compose with other module loaders
- [ ] external assertion library (chai, jest)
- [ ] external esm mocking (esmock, quibble)
- [ ] external code coverage (c8)
- [ ] external watch tool (based on same --loader as the esm mocking??)
- [ ] external bundler (vite),
- [ ] external transpiler (typescript, jsx)
- [ ] external DOM (browser, jsdom, happy-dom)

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
