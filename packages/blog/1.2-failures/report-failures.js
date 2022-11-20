import { AssertionError } from "node:assert";
import assert from "node:assert/strict";
import { inspect } from "node:util";

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
function run(reporter) {
  testList.forEach((test) => {
    const { name, fn } = test;
    try {
      fn();
      reporter({ type: "success", name });
    } catch (ex) {
      if (ex instanceof AssertionError) {
        const { message } = ex;
        reporter({ type: "failure", name, message });
      } else {
        reporter({ type: "error", name, message: inspect(ex) });
      }
    }
  });
}

// (3) code under test

/**
 * @param { number } a
 * @param { number } b
 * @returns { number }
 */
function add(a, b) {
  return a + b;
}

// (4) test code

it("should fail", () => {
  assert.equal(add(2, 2), 5);
});

it("should calculate the sum", () => {
  assert.equal(add(2, 2), 4);
});

// (5) invoking the test runner

let failureCount = 0;
/** @type { Reporter } */
const failureAggregator = ({ type }) => {
  if (["failure", "error"].includes(type)) ++failureCount;
};
const reporter = combineReporters([consoleReporter, failureAggregator]);
run(reporter);
process.exit(failureCount);
