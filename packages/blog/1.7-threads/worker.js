import { AssertionError } from "node:assert";
import { pathToFileURL } from "node:url";
import { inspect } from "node:util";
import { isPromise } from "node:util/types";
import { workerData, parentPort } from "node:worker_threads";

import { root } from "./index.js";

/** @typedef { import('./index.js').Test } Test */
/** @typedef { import('./reporter.js').Reporter } Reporter */

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

const path = workerData;
await import(pathToFileURL(path).href);
/** @type { Reporter } */
const postReporter = (event) => parentPort?.postMessage(event);
await run(postReporter);
