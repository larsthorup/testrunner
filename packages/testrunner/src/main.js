import defaultReporter from "./console-reporter.js";

import { loader, concurrentLoader } from "./loader.js";
import { combineReporters } from "./multi-reporter.js";

/** @typedef {import("./report-event.js").ReportEvent} ReportEvent */

/**
 * @param {string[]} testFilePaths
 * @param {boolean} concurrent
 */
export default async function main(testFilePaths, concurrent) {
  // TODO: run in browser or node
  // TODO: tab / process / worker isolation or not
  // TODO: external sharding for multiple processes / machines

  // Note: shard test files for multiple threads
  let failureCount = 0;
  /**
   * @param {ReportEvent} event
   */
  const failureAggregator = ({ scope, type }) => {
    if (scope === "test" && type === "failure") ++failureCount;
  };
  const reporters = combineReporters([failureAggregator, defaultReporter]);
  let concurrency = 0;
  const msStart = Date.now();
  if (concurrent) {
    ({ concurrency } = await concurrentLoader(testFilePaths, reporters));
  } else {
    concurrency = 1;
    await loader(testFilePaths, reporters);
  }
  const msDuration = Date.now() - msStart;

  // TODO: report test results
  // TODO: report delta coverage compared to base branch
  // TODO: report timing to aggregate with previous runs
  return { concurrency, failureCount, msDuration };
}
