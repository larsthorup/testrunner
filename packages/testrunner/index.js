import { isPromise } from 'util/types';

/** @typedef { { type: 'describe'; name: string; testList: Test[] } } Describe */
/** @typedef { { type: 'it'; name: string; fn: () => Promise<any> | void } } It */
/** @typedef { Describe | It } Test */

/** @type { Test} */
const globalTest = { type: 'describe', name: '', testList: [] };
let currentTest = globalTest;

/**
 * @param {string} name
 * @param {() => void} fn
 */
export const describe = (name, fn) => {
  // console.log('describe', name);
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
 * @param {() => Promise<any> | void} fn
 */
export const it = (name, fn) => {
  // console.log('it', name);
  /** @type { It} */
  const it = { type: 'it', name, fn };
  currentTest.testList.push(it);
};

// TODO: beforeAll, beforeEach, afterAll, afterEach
// TODO: useSetup

export const runner = async () => {
  // TODO: instrument for coverage
  await run(globalTest, []);
  // TODO: report test results
  // TODO: report coverage
  // TODO: report delta coverage compared to base branch
};

/**
 * @param { Test } test
 * @param { Test[] } parentTestList
 */
const run = async (test, parentTestList) => {
  // TODO: filter tests based on explicit criteria, watched changes, explicit test order
  // TODO: randomize test order or not
  // TODO: parallelism or not
  switch (test.type) {
    case 'describe':
      for (const childTest of test.testList) {
        const fullTestList = parentTestList.concat([childTest]);
        await run(childTest, fullTestList);
      }
      break;
    case 'it':
      {
        const fullName = parentTestList.map(({ name }) => name).join(' - ');
        const { fn } = test;
        // console.log('before', fullName);
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
        // console.log('after', fullName);
      }
      break;
  }
};
