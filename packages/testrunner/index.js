import { isPromise } from 'util/types';

/** @typedef { { type: 'afterAll'; name: string;  fn: Fn} } AfterAll */
/** @typedef { { type: 'afterEach'; name: string; fn: Fn } } AfterEach */
/** @typedef { { type: 'beforeAll'; name: string;  fn: Fn} } BeforeAll */
/** @typedef { { type: 'beforeEach'; name: string;  fn: Fn} } BeforeEach */
/** @typedef { { type: 'describe'; name: string; testList: Test[] } } Describe */
/** @typedef { () => Promise<any> | void  } Fn */
/** @typedef { { type: 'it'; name: string; fn: Fn } } It */
/** @typedef { AfterAll | AfterEach | BeforeAll | BeforeEach | Describe | It } Test */

/** @type { Test } */
const globalTest = { type: 'describe', name: '', testList: [] };
let currentTest = globalTest;

/**
 * @param {Fn} fn
 */
export const afterAll = (fn) => {
  /** @type { AfterAll } */
  const afterAll = { type: 'afterAll', name: 'afterAll', fn };
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
 * @param {() => void} fn
 */
export const describe = (name, fn) => {
  /** @type { Describe} */
  const describe = { type: 'describe', name, testList: [] };
  currentTest.testList.push(describe);
  const previousTest = currentTest;
  currentTest = describe;
  fn();
  currentTest = previousTest;
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

// TODO: beforeAll, beforeEach, afterAll, afterEach
// TODO: useSetup

export const runner = async () => {
  // TODO: instrument for coverage
  await runTests(globalTest, []);
  // TODO: report test results
  // TODO: report coverage
  // TODO: report delta coverage compared to base branch
};

/**
 * @param { Test } test
 * @param { Test[] } parentTestList
 */
const runTests = async (test, parentTestList) => {
  // TODO: filter tests based on explicit criteria, watched changes, explicit test order
  // TODO: randomize test order or not
  // TODO: parallelism or not
  switch (test.type) {
    case 'describe':
      {
        const beforeAllList = /** @type BeforeAll[] */ (
          parentTestList.filter(({ type }) => type === 'beforeAll')
        );
        for (const beforeAll of beforeAllList) {
          const fullTestList = parentTestList.concat([beforeAll]);
          await runTest(beforeAll, fullTestList);
        }
        for (const childTest of test.testList) {
          const fullTestList = parentTestList.concat([childTest]);
          await runTests(childTest, fullTestList);
        }
        const afterAllList = /** @type AfterAll[] */ (
          parentTestList.filter(({ type }) => type === 'afterAll')
        );
        for (const afterAll of afterAllList.reverse()) {
          const fullTestList = parentTestList.concat([afterAll]);
          await runTest(afterAll, fullTestList);
        }
      }
      break;
    case 'it':
      {
        const describeList = /** @type Describe[] */ (
          parentTestList.filter(({ type }) => type === 'describe')
        );
        for (const describe of describeList) {
          const beforeEachList = /** @type BeforeEach[] */ (
            describe.testList.filter(({ type }) => type === 'beforeEach')
          );
          for (const beforeEach of beforeEachList) {
            const fullTestList = parentTestList.concat([beforeEach]);
            await runTest(beforeEach, fullTestList);
          }
        }
        await runTest(test, parentTestList);
        for (const describe of describeList.reverse()) {
          const afterEachList = /** @type AfterEach[] */ (
            describe.testList.filter(({ type }) => type === 'afterEach')
          );
          for (const afterEach of afterEachList.reverse()) {
            const fullTestList = parentTestList.concat([afterEach]);
            await runTest(afterEach, fullTestList);
          }
        }
      }
      break;
  }
};

/**
 * @param { AfterAll | AfterEach | BeforeAll | BeforeEach | It } test
 * @param { Test[] } parentTestList
 */
const runTest = async (test, parentTestList) => {
  const fullName = parentTestList.map(({ name }) => name).join(' - ');
  const { fn } = test;
  try {
    // TODO: run in browser or node
    // TODO: process isolation or not
    // TODO: pass in test context
    const result = fn();
    if (isPromise(result)) await result;
    console.log('✔', fullName);
  } catch (ex) {
    // TODO: pluggable reporter
    console.log('x', fullName, ex);
  }
};
