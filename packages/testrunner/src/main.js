import reporter from "./reporter.js";

import loader from "./loader.js";
import poolLoader from "./pool.js";

/**
 * @param {string[]} testFilePaths
 * @param {boolean} concurrent
 */
export default async function main(testFilePaths, concurrent) {
  // TODO: run in browser or node
  // TODO: tab / process / worker isolation or not
  // TODO: external sharding for multiple processes / machines

  // Note: shard test files for multiple threads
  let failureCount = 0; // TODO: use a reporter for this
  let concurrency = 0;
  const msStart = Date.now();
  if (concurrent) {
    ({ concurrency, failureCount } = await poolLoader(testFilePaths, reporter));
  } else {
    concurrency = 1;
    ({ failureCount } = await loader(testFilePaths, reporter));
  }
  const msDuration = Date.now() - msStart;

  // TODO: report test results
  // TODO: report delta coverage compared to base branch
  // TODO: report timing to aggregate with previous runs
  return { concurrency, failureCount, msDuration };
}
