import * as os from "node:os";

import consoleReporter from "@larsthorup/console-reporter-plugin";

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

  let failureCount = 0;
  /**
   * @param {ReportEvent} event
   */
  const failureAggregator = ({ scope, type }) => {
    if (scope === "test" && ["failure", "error"].includes(type)) ++failureCount;
  };
  const configuredReporter = consoleReporter; // TODO: configure and import dynamically
  const reporters = combineReporters([failureAggregator, configuredReporter]);
  const concurrency = concurrent ? os.cpus().length : 1;
  const fileCount = testFilePaths.length;
  reporters({ scope: "run", type: "begin", data: { concurrency, fileCount } });
  const msStart = Date.now();
  if (concurrent) {
    await concurrentLoader(concurrency, testFilePaths, reporters);
  } else {
    await loader(testFilePaths, reporters);
  }
  const duration = Date.now() - msStart;
  reporters({ scope: "run", type: "done", data: { duration, failureCount } });

  // TODO: report delta coverage compared to base branch
  // TODO: report timing to aggregate with previous runs
  return failureCount;
}
