import { AssertionError } from "node:assert";
import assert from "node:assert/strict";
import EventEmitter from "node:events";
import { inspect } from "node:util";
import { isPromise } from "node:util/types";

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

/** @typedef { () => void } Fn */
/** @typedef { {type: "it", name: string, fn: Fn} } It */
/** @typedef { {type: "describe", name: string, testList: Test[]} } Describe */
/** @typedef { It | Describe } Test */

/** @type { Describe } */
const root = { type: "describe", name: "", testList: [] };
let currentDescribe = root;

/**
 * @param { string } name
 * @param { Fn } fn
 */
function it(name, fn) {
  /** @type { It } */
  const it = { type: "it", name, fn };
  currentDescribe.testList.push(it);
}

/**
 * @param { string } name
 * @param { Fn } fn
 */
function describe(name, fn) {
  /** @type { Describe } */
  const describe = { type: "describe", name, testList: [] };
  currentDescribe.testList.push(describe);
  const previousDescribe = currentDescribe;
  currentDescribe = describe;
  fn();
  currentDescribe = previousDescribe;
}

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

// (3) code under test

/**
 * @param { number } a
 * @param { number } b
 * @returns { number }
 */
function add(a, b) {
  return a + b;
}

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

describe("add", () => {
  it("should calculate the sum", () => {
    assert.equal(add(2, 2), 4);
  });
});

describe("createTimer", () => {
  it("should eventually ring", async () => {
    const timer = createTimer(50);
    await new Promise((resolve) => timer.on("ring", resolve));
  });
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
