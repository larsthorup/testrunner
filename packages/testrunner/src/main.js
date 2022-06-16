import { pathToFileURL } from 'node:url';
import { promisify } from 'node:util';

import glob from 'glob';

import { runner } from './runner.js';
import { globalTest } from './collector.js';

export default async function main() {
  // TODO: specify pattern as CLI argument
  const testFilePattern = './src/*.test.js';
  const testFilePaths = await promisify(glob)(testFilePattern);
  const testFileUrls = testFilePaths.map(
    (filePath) => pathToFileURL(filePath).href
  );

  // TODO: use watcher to provide additional test filter
  // TODO: instrument for coverage
  // TODO: run in browser or node
  // TODO: tab / process / worker isolation or not

  // Note: collect all tests by loading all test files and running global side effects
  await Promise.all(
    testFileUrls.map(async (testFileUrl) => {
      await import(testFileUrl);
      // console.log('loaded', testFileUrl);
    })
  );

  // Note: run tests
  await runner(globalTest);

  // TODO: report test results
  // TODO: report coverage
  // TODO: report delta coverage compared to base branch
}
