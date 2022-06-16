/** @typedef { { type: 'afterAll'; name: string;  fn: Fn} } AfterAll */
/** @typedef { { type: 'afterEach'; name: string; fn: Fn } } AfterEach */
/** @typedef { { type: 'beforeAll'; name: string;  fn: Fn} } BeforeAll */
/** @typedef { { type: 'beforeEach'; name: string;  fn: Fn} } BeforeEach */
/** @typedef { { type: 'describe'; name: string; testList: Test[] } } Describe */
/** @typedef { () => Promise<any> | void  } Fn */
/** @typedef { { type: 'it'; name: string; fn: Fn } } It */
/** @typedef { AfterAll | AfterEach | BeforeAll | BeforeEach | Describe | It } Test */

/** @type { Test } */
export const globalTest = { type: 'describe', name: '', testList: [] };
let currentTest = globalTest;

/**
 * @param {string | Fn} nameOrFn
 * @param {Fn | undefined} [fnOrUndefined]
 */
export const afterAll = (nameOrFn = 'afterAll', fnOrUndefined = undefined) => {
  const name = typeof nameOrFn === 'string' ? nameOrFn : 'afterAll';
  const fn =
    typeof nameOrFn === 'function'
      ? nameOrFn
      : fnOrUndefined !== undefined
      ? fnOrUndefined
      : () => {};
  /** @type { AfterAll } */
  const afterAll = { type: 'afterAll', name, fn };
  currentTest.testList.push(afterAll);
};

/**
 * @param {Fn} fn
 */
export const afterEach = (fn) => {
  /** @type { AfterEach } */
  const afterEach = { type: 'afterEach', name: 'afterEach', fn };
  currentTest.testList.push(afterEach);
};

/**
 * @param {Fn} fn
 */
export const beforeAll = (fn) => {
  /** @type { BeforeAll } */
  const beforeAll = { type: 'beforeAll', name: 'beforeAll', fn };
  currentTest.testList.push(beforeAll);
};

/**
 * @param {Fn} fn
 */
export const beforeEach = (fn) => {
  /** @type { BeforeEach } */
  const beforeEach = { type: 'beforeEach', name: 'beforeEach', fn };
  currentTest.testList.push(beforeEach);
};

/**
 * @param {string} name
 * @param {() => void | undefined} [fn]
 */
export const describe = (name, fn) => {
  /** @type { Describe} */
  const describe = { type: 'describe', name, testList: [] };
  currentTest.testList.push(describe);
  if (fn) {
    const previousTest = currentTest;
    currentTest = describe;
    fn();
    currentTest = previousTest;
  }
};

/**
 * @param {string} name
 * @param {Fn} fn
 */
export const it = (name, fn) => {
  /** @type { It} */
  const it = { type: 'it', name, fn };
  currentTest.testList.push(it);
};
