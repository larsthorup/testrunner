import { isPromise } from "node:util/types";

/** @typedef {import("./collector.js").AfterAll} AfterAll */
/** @typedef {import("./collector.js").AfterEach} AfterEach */
/** @typedef {import("./collector.js").BeforeAll} BeforeAll */
/** @typedef {import("./collector.js").BeforeEach} BeforeEach */
/** @typedef {import("./collector.js").Describe} Describe */
/** @typedef {import("./collector.js").It} It */
/** @typedef {import("./collector.js").Test} Test */

class TestSkipException extends Error {
  /**
   *
   * @param {string} reason
   */
  constructor(reason) {
    super(reason);
  }
}

/**
 *
 * @param {string | undefined} [reason]
 */
export const skip = (reason) => {
  throw new TestSkipException(reason || "");
};

/**
 * @param { Test } root
 */
export const runner = async (root) => {
  return runTests(root, []);
};

/**
 * @param { Test } test
 * @param { Test[] } parentTestList
 */
const runTests = async (test, parentTestList) => {
  let failureCount = 0;
  // TODO: filter tests based on explicit criteria, watch filter, explicit test order
  // TODO: shuffle tests based on serial / random test order
  // TODO: concurrent or sequential or not
  switch (test.type) {
    case "describe":
      {
        const beforeAllList = /** @type BeforeAll[] */ (
          test.testList.filter(({ type }) => type === "beforeAll")
        );
        for (const beforeAll of beforeAllList) {
          const fullTestList = parentTestList.concat([beforeAll]);
          failureCount += await runTest(beforeAll, fullTestList);
        }
        for (const childTest of test.testList) {
          const fullTestList = parentTestList.concat([childTest]);
          failureCount += await runTests(childTest, fullTestList);
        }
        const afterAllList = /** @type AfterAll[] */ (
          test.testList.filter(({ type }) => type === "afterAll")
        );
        for (const afterAll of afterAllList.reverse()) {
          const fullTestList = parentTestList.concat([afterAll]);
          failureCount += await runTest(afterAll, fullTestList);
        }
      }
      break;
    case "it":
      {
        const describeList = /** @type Describe[] */ (
          parentTestList.filter(({ type }) => type === "describe")
        );
        for (const describe of describeList) {
          const beforeEachList = /** @type BeforeEach[] */ (
            describe.testList.filter(({ type }) => type === "beforeEach")
          );
          for (const beforeEach of beforeEachList) {
            const fullTestList = parentTestList.concat([beforeEach]);
            failureCount += await runTest(beforeEach, fullTestList);
          }
        }
        failureCount += await runTest(test, parentTestList);
        for (const describe of describeList.reverse()) {
          const afterEachList = /** @type AfterEach[] */ (
            describe.testList.filter(({ type }) => type === "afterEach")
          );
          for (const afterEach of afterEachList.reverse()) {
            const fullTestList = parentTestList.concat([afterEach]);
            failureCount += await runTest(afterEach, fullTestList);
          }
        }
      }
      break;
  }
  return failureCount;
};

/**
 * @param { AfterAll | AfterEach | BeforeAll | BeforeEach | It } test
 * @param { Test[] } parentTestList
 */
const runTest = async (test, parentTestList) => {
  let failureCount = 0;
  const fullName = parentTestList.map(({ name }) => name).join(" - ");
  const { fn } = test;
  try {
    // TODO: pass in test context
    const result = fn();
    if (isPromise(result)) {
      await result;
    }
    console.log("✔", fullName);
  } catch (ex) {
    if (ex instanceof TestSkipException) {
      console.log("↓", fullName, " - ", ex.message);
    } else {
      // TODO: pluggable reporter
      console.log("x", fullName, " - ", ex);
      failureCount += 1;
    }
  }
  return failureCount;
};
