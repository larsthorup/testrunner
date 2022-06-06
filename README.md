# @larsthorup/testrunner

A better test runner.

```bash
npm run install:all
npm run test
```

## TODO

- prettier
- eslint
- typescript check types imported with jsdoc

## Scope

- [x] comparison with mocha,
- [x] no commonjs support (modernity)
- [x] no globals (simplicity)
- [x] external assertion library (node:assert)
- [x] do not capture output (fix)
- [x] nested describe, it (standard)
- [x] run mixed its and describes in defined order (fix)
- [ ] sync and async (standard)
- [ ] typed (modernity)
- [ ] self tested
- [ ] useSetup (fix)
- [ ] pass in test context (extensibility)
- [ ] tests in production code files (fix)
- [ ] dynamic skip (fix)
- [ ] extendable timeouts (fix)
- [ ] process isolation - default off - opt-in per test (catch more bugs)
- [ ] random test order - default off - opt-in per test (catch more bugs)
- [ ] pluggable reporting (standard)
- [ ] controlable parallelism (standard)
- [ ] run in node or browser (standard)
- [ ] run on windows and posix (standard)
- [ ] IDE integration
- [ ] comparison with node:test, vitest, jest, tap, ava
- [ ] compose with other module loaders
- [ ] external assertion library (node:assert, chai, jest)
- [ ] external esm mocking (esmock, quibble)
- [ ] external code coverage (c8)
- [ ] external watch tool (based on same --loader as the esm mocking??)
- [ ] external bundler (vite),
- [ ] external transpiler (typescript, jsx)
- [ ] external DOM (browser, jsdom, happy-dom)

## ESM module mocking

- https://dev.to/giltayar/mock-all-you-want-supporting-es-modules-in-the-testdouble-js-mocking-library-3gh1
- https://www.npmjs.com/package/esmock
- https://github.com/testdouble/testdouble.js - td.replaceEsm
- https://www.npmjs.com/package/quibble
- native npm support for mocking via standard supplied --loader ??
