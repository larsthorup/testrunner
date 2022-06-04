# @larsthorup/testrunner

## Scope

- [ ] no globals (simplicity)
- [ ] no commonjs support (modernity)
- [ ] typed (modernity)
- [ ] run mixed tests and describes in order (fix)
- [ ] pass in test context (extensibility)
- [ ] dynamic skip (fix)
- [ ] tests in production code files (fix)
- [ ] do not capture output (fix)
- [ ] useSetup (fix)
- [ ] sync and async (standard)
- [ ] process isolation - default off - op-in per test (catch more bugs)
- [ ] extendable timeouts (fix)
- [ ] pluggable reporting
- [ ] controlable parallelism
- [ ] run in node or browser
- [ ] run on windows and posix
- [ ] compose with other module loaders
- [ ] external assertion library (chai)
- [ ] external esm mocking (esmock, quibble)
- [ ] external code coverage (c8)
- [ ] external watch tool (based on same --loader as the esm mocking??)
- [ ] external bundler (vite),
- [ ] external transpiler (typescript, jsx)
- [ ] external DOM (browser, jsdom, happy-dom)
- [ ] comparison with vitest, mocha, jest, tap, ava

## ESM module mocking

- https://dev.to/giltayar/mock-all-you-want-supporting-es-modules-in-the-testdouble-js-mocking-library-3gh1
- https://www.npmjs.com/package/esmock
- https://github.com/testdouble/testdouble.js - td.replaceEsm
- https://www.npmjs.com/package/quibble
- native npm support for mocking via standard supplied --loader ??
