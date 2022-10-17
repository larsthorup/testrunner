import { promisify } from "node:util";

import glob from "glob";
import Tinypool from "tinypool";

import worker from "./worker.js";

/**
 * @param {string} testFilePattern
 * @param {boolean} concurrent
 */
export default async function main(testFilePattern, concurrent) {
  const testFilePaths = await promisify(glob)(testFilePattern);

  // TODO: use dependency watcher to filter only tests impacted by changed files
  // TODO: instrument for coverage
  // TODO: run in browser or node
  // TODO: tab / process / worker isolation or not
  // TODO: distribute shards for multiple processes / machines

  // Note: shard test files for multiple threads
  let failureCount = 0;
  let concurrency = 0;
  const msStart = Date.now();
  if (concurrent) {
    const pool = new Tinypool({
      filename: new URL("./worker.js", import.meta.url).href,
      isolateWorkers: false, // TODO: configure
    });
    concurrency = pool.threads.length;
    const failureCounts = await Promise.all(
      testFilePaths.map((testFilePath) => pool.run([testFilePath]))
    );
    failureCount = failureCounts.reduce((sum, value) => sum + value, 0);
  } else {
    concurrency = 1;
    failureCount = await worker(testFilePaths);
  }
  const msDuration = Date.now() - msStart;

  // TODO: report test results
  // TODO: report coverage
  // TODO: report delta coverage compared to base branch
  // TODO: report timing to aggregate with previous runs
  return { concurrency, failureCount, msDuration };
}
