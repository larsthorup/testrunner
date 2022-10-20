import Tinypool from "tinypool";

import worker from "./worker.js";

/**
 * @param {string[]} testFilePaths
 * @param {boolean} concurrent
 */
export default async function main(testFilePaths, concurrent) {
  // TODO: external dependency watcher to filter only tests impacted by changed files
  // TODO: external coverage instrumentation
  // TODO: run in browser or node
  // TODO: tab / process / worker isolation or not
  // TODO: external sharding for multiple processes / machines

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
    const testResults = await Promise.all(
      testFilePaths.map((testFilePath) => pool.run([testFilePath]))
    );
    failureCount = testResults.reduce(
      (sum, { failureCount }) => sum + failureCount,
      0
    );
  } else {
    concurrency = 1;
    ({ failureCount } = await worker(testFilePaths));
  }
  const msDuration = Date.now() - msStart;

  // TODO: report test results
  // TODO: report coverage
  // TODO: report delta coverage compared to base branch
  // TODO: report timing to aggregate with previous runs
  return { concurrency, failureCount, msDuration };
}
