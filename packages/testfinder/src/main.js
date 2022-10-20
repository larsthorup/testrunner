import { promisify } from "node:util";

import glob from "glob";

/**
 * @param {string} testFilePattern
 */
export default async function main(testFilePattern) {
  const testFilePaths = await promisify(glob)(testFilePattern);
  return testFilePaths;
}
