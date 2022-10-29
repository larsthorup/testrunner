import { AssertionError } from "node:assert";
import { isPromise } from "node:util/types";
import { inspect } from "node:util";
import { skip, TestSkipException } from "./collector.js";

/** @typedef {import("./collector.js").AfterAll} AfterAll */
/** @typedef {import("./collector.js").AfterEach} AfterEach */
/** @typedef {import("./collector.js").BeforeAll} BeforeAll */
/** @typedef {import("./collector.js").BeforeEach} BeforeEach */
/** @typedef {import("./collector.js").Describe} Describe */
/** @typedef {import("./collector.js").It} It */
/** @typedef {import("./collector.js").Test} Test */
/** @typedef {import('./report-event.js').ReportEvent} ReportEvent */

/**
 * @param { Test } root
 * @param { (event: ReportEvent) => void } report
 */
export const runner = async (root, report) => {
  skipPlugin(root);
  onlyPlugin(root); // TODO: traverse({})
  return runTests(root, report, [root]);
};

/**
 * @param {Test} root
 */
const skipPlugin = (root) => {
  traverse(
    root,
    function beforeChildren(test) {
      switch (test.type) {
        case "describe":
          if (test.options.skip) {
            for (const subTest of test.testList) {
              if (subTest.type === "describe" || subTest.type === "it") {
                subTest.options.skip = true;
              }
            }
          }
          break;
        case "it":
          if (test.options.skip) {
            test.fn = skip;
          }
          break;
      }
    },
    function afterChildren() {
      // TODO: skip hooks if all tests are skipped?
    }
  );
};

/**
 * @param {Test} root
 */
const onlyPlugin = (root) => {
  let hasOnly = false;
  traverse(
    root,
    function beforeChildren(test) {
      if (test.type === "it" && test.options.only) hasOnly = true;
    },
    function afterChildren() {}
  );
  if (hasOnly) {
    traverse(
      root,
      function beforeChildren() {},
      function afterChildren(test) {
        switch (test.type) {
          case "describe":
            if (!test.options.only) {
              test.testList = [];
            }
            break;
          case "it":
            if (!test.options.only) {
              test.fn = skip;
            }
            break;
        }
        // TODO: children of describe: if some has "only" - delete the rest + mark describe with "only"
      }
    );
  }
};

/**
 * @param {Test} test
 * @param {(test: Test) => void} beforeChildren
 * @param {(test: Test) => void} afterChildren
 */
const traverse = (test, beforeChildren, afterChildren) => {
  beforeChildren(test);
  if (test.type === "describe") {
    for (const subTest of test.testList)
      traverse(subTest, beforeChildren, afterChildren);
  }
  afterChildren(test);
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
  const parentTestListExceptRoot = parentTestList.slice(1);
  const names = parentTestListExceptRoot.map(({ name }) => name);
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
