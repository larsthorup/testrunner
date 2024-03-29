import { AssertionError } from "node:assert";
import { isPromise } from "node:util/types";
import { inspect } from "node:util";

import { plugin as skipPlugin } from "@larsthorup/skip-testrunner-plugin";
import { plugin as onlyPlugin } from "@larsthorup/only-testrunner-plugin";

import { TestSkipException } from "./collector.js";

/** @typedef {import("./collector.js").AfterAll} AfterAll */
/** @typedef {import("./collector.js").AfterEach} AfterEach */
/** @typedef {import("./collector.js").BeforeAll} BeforeAll */
/** @typedef {import("./collector.js").BeforeEach} BeforeEach */
/** @typedef {import("./collector.js").Describe} Describe */
/** @typedef {import("./collector.js").It} It */
/** @typedef {import("./collector.js").Test} Test */
/** @typedef {import('./report-event.js').ReportEvent} ReportEvent */
/** @typedef {import('./runner.js').Visit} Visit */
/** @typedef {import('./runner.js').Plugin} Plugin */

/**
 * @param { Test } root
 * @param { (event: ReportEvent) => void } report
 */
export const runner = async (root, report) => {
  const plugins = [skipPlugin(), onlyPlugin()]; // TODO: configure and import dynamically
  for (const plugin of plugins) preVisit(root, plugin);
  for (const plugin of plugins) visit(root, plugin);
  await runTests(root, report, [root]);
};

/**
 * @param {Test} root
 * @param {Plugin} plugin
 */
const preVisit = (root, plugin) => {
  const { preVisit: visitBeforeChildren = () => {} } = plugin;
  traverse(root, visitBeforeChildren, () => {});
};

/**
 * @param {Test} root
 * @param {Plugin} plugin
 */
const visit = (root, plugin) => {
  const { visitBeforeChildren = () => {} } = plugin;
  const { visitAfterChildren = () => {} } = plugin;
  traverse(root, visitBeforeChildren, visitAfterChildren);
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
