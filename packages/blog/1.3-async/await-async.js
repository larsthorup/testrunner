import { AssertionError } from "node:assert";
// import assert from "node:assert/strict";
import EventEmitter from "node:events";
import { inspect } from "node:util";
import { isPromise } from "node:util/types";

// (1) reporters

/** @typedef { { type: string; name: string; message?: string } } ReporterEvent */
/** @typedef { (event: ReporterEvent) => void } Reporter */

/** @type { Reporter } */
function consoleReporter(event) {
  const { type, name, message } = event;
  switch (type) {
    case "error":
      console.log("!", name, message);
      break;
    case "failure":
      console.log("x", name, message);
      break;
    case "success":
      console.log("✔", name);
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

/** @typedef { () => void } Fn */

/** @type { {name: string, fn: Fn}[] } */
const testList = [];

/**
 * @param { string } name
 * @param { Fn } fn
 */
function it(name, fn) {
  testList.push({ name, fn });
}

/**
 * @param { Reporter } reporter
 */
async function run(reporter) {
  for (const test of testList) {
    const { name, fn } = test;
    try {
      const result = fn();
      if (isPromise(result)) {
        await result;
      }
      reporter({ type: "success", name });
    } catch (ex) {
      if (ex instanceof AssertionError) {
        const { message } = ex;
        reporter({ type: "failure", name, message });
      } else {
        reporter({ type: "error", name, message: inspect(ex) });
      }
    }
  }
}

// (3) code under test

/**
 * @param { number } ms
 * @returns { EventEmitter }
 */
function createTimer(ms) {
  const timer = new EventEmitter();
  setTimeout(() => timer.emit("ring"), ms);
  return timer;
}

// (4) test code

it("should eventually ring", async () => {
  const timer = createTimer(50);
  await new Promise((resolve) => timer.on("ring", resolve));
});

// (5) invoking the test runner

let failureCount = 0;
/** @type { Reporter } */
const failureAggregator = ({ type }) => {
  if (["failure", "error"].includes(type)) ++failureCount;
};
const reporter = combineReporters([consoleReporter, failureAggregator]);
await run(reporter);
process.exit(failureCount);
