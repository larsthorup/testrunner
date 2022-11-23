import { AssertionError } from "node:assert";
import { pathToFileURL } from "node:url";
import { inspect } from "node:util";
import { isPromise } from "node:util/types";

import { root } from "./index.js";

// (1) reporters

/** @typedef { { type: string; names: string[]; message?: string } } ReporterEvent */
/** @typedef { (event: ReporterEvent) => void } Reporter */

/** @type { Reporter } */
function consoleReporter(event) {
  const { type, names, message } = event;
  const fullName = names.join(" - ");
  switch (type) {
    case "error":
      console.log("!", fullName, message);
      break;
    case "failure":
      console.log("x", fullName, message);
      break;
    case "success":
      console.log("✔", fullName);
      break;
  }
}

/**
 * @param {Reporter[]} reporters
 * @returns {Reporter}
 */
const combineReporters = (reporters) => (event) => {
  reporters.forEach((report) => report(event));
};

// (2) test runner code

/** @typedef { import('./index.js').Test } Test */

/**
 * @param { Reporter } reporter
 */
async function run(reporter) {
  await runTest(reporter, root, [root]);
}

/**
 * @param { Reporter } reporter
 * @param { Test } test
 * @param { Test[] } parentTests
 */
async function runTest(reporter, test, parentTests) {
  const { type } = test;
  switch (type) {
    case "describe": {
      const { testList } = test;
      for (const childTest of testList) {
        await runTest(reporter, childTest, [...parentTests, childTest]);
      }
      break;
    }
    case "it": {
      const { fn } = test;
      const names = parentTests.slice(1).map(({ name }) => name);
      try {
        const result = fn();
        if (isPromise(result)) {
          await result;
        }
        reporter({ type: "success", names });
      } catch (ex) {
        if (ex instanceof AssertionError) {
          const { message } = ex;
          reporter({ type: "failure", names, message });
        } else {
          reporter({
            type: "error",
            names,
            message: inspect(ex),
          });
        }
      }
      break;
    }
  }
}

// (4) loading the test files

const testFiles = process.argv.slice(2);
for (const path of testFiles) {
  await import(pathToFileURL(path).href);
}

// (5) invoking the test runner

let failureCount = 0;
/** @type { Reporter } */
const failureAggregator = ({ type }) => {
  if (["failure", "error"].includes(type)) ++failureCount;
};
const reporter = combineReporters([consoleReporter, failureAggregator]);
await run(reporter);
process.exit(failureCount);
