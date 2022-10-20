import { promisify } from "node:util";

import glob from "glob";

/**
 * @param {string} testFilePattern
 */
export default function main(testFilePattern) {
  const testFilePaths = promisify(glob)(testFilePattern);
  return testFilePaths;
}
