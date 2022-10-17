import { runner } from "./runner.js";
import { collector } from "./collector.js";

/**
 * @param {string[]} testFilePaths
 */
export default async (testFilePaths) => {
  // Note: collect all tests by loading all test files and running global side effects
  const root = await collector(testFilePaths);

  // Note: run tests
  const failureCount = await runner(root);

  return failureCount;
};
