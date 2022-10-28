import { AssertionError } from "node:assert";
import { isPromise } from "node:util/types";
import { inspect } from "node:util";
("node:util");

/** @typedef {import("./collector.js").AfterAll} AfterAll */
/** @typedef {import("./collector.js").AfterEach} AfterEach */
/** @typedef {import("./collector.js").BeforeAll} BeforeAll */
/** @typedef {import("./collector.js").BeforeEach} BeforeEach */
/** @typedef {import("./collector.js").Describe} Describe */
/** @typedef {import("./collector.js").It} It */
/** @typedef {import("./collector.js").Test} Test */
/** @typedef {import('./report-event.js').ReportEvent} ReportEvent */

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
 * @param { (event: ReportEvent) => void } report
 */
export const runner = async (root, report) => {
  return runTests(root, report, []);
};

/**
 * @param { Test } test
 * @param { (event: ReportEvent) => void } report
 * @param { Test[] } parentTestList
 */
const runTests = async (test, report, parentTestList) => {
  // TODO: filter tests based on explicit criteria, watch filter, explicit test order
  // TODO: shuffle tests based on serial / random / sorted test order
  // TODO: concurrent or sequential or not
  switch (test.type) {
    case "describe":
      {
        const beforeAllList = /** @type BeforeAll[] */ (
          test.testList.filter(({ type }) => type === "beforeAll")
        );
        for (const beforeAll of beforeAllList) {
          const fullTestList = parentTestList.concat([beforeAll]);
          await runTest(beforeAll, report, fullTestList);
        }
        for (const childTest of test.testList) {
          const fullTestList = parentTestList.concat([childTest]);
          await runTests(childTest, report, fullTestList);
        }
        const afterAllList = /** @type AfterAll[] */ (
          test.testList.filter(({ type }) => type === "afterAll")
        );
        for (const afterAll of afterAllList.reverse()) {
          const fullTestList = parentTestList.concat([afterAll]);
          await runTest(afterAll, report, fullTestList);
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
            await runTest(beforeEach, report, fullTestList);
          }
        }
        await runTest(test, report, parentTestList);
        for (const describe of describeList.reverse()) {
          const afterEachList = /** @type AfterEach[] */ (
            describe.testList.filter(({ type }) => type === "afterEach")
          );
          for (const afterEach of afterEachList.reverse()) {
            const fullTestList = parentTestList.concat([afterEach]);
            await runTest(afterEach, report, fullTestList);
          }
        }
      }
      break;
  }
};

/**
 * @param { AfterAll | AfterEach | BeforeAll | BeforeEach | It } test
 * @param { (event: ReportEvent) => void } report
 * @param { Test[] } parentTestList
 */
const runTest = async (test, report, parentTestList) => {
  const scope = "test";
  const names = parentTestList.map(({ name }) => name);
  const { fn } = test;
  try {
    // TODO: pass in test context
    const result = fn();
    if (isPromise(result)) {
      await result;
    }
    report({ scope, type: "success", data: { names } });
  } catch (ex) {
    if (ex instanceof TestSkipException) {
      report({
        scope,
        type: "skip",
        data: { names, message: ex.message },
      });
    } else if (ex instanceof AssertionError) {
      report({
        scope,
        type: "failure",
        data: { names, message: ex.message },
      });
    } else {
      report({
        scope,
        type: "error",
        data: { names, message: inspect(ex) },
      });
    }
  }
};
