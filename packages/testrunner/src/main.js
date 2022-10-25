import defaultReporter from "./reporter.js";

import loader from "./loader.js";
import poolLoader from "./pool.js";

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
  /**
   * @param {((event: ReportEvent) => void)[]} reporters
   * @returns {(event: ReportEvent) => void}
   */
  const combineReporters = (reporters) => (event) => {
    reporters.forEach((report) => report(event));
  };
  const reporters = combineReporters([failureAggregator, defaultReporter]);
  let concurrency = 0;
  const msStart = Date.now();
  if (concurrent) {
    ({ concurrency } = await poolLoader(testFilePaths, reporters));
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
