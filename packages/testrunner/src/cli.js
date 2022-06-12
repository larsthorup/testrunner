#!/usr/bin/env node

import process from 'node:process';
import { pathToFileURL } from 'node:url';
import { promisify } from 'node:util';

import glob from 'glob';

import { runner } from './index.js';

process.on('uncaughtException', (err, origin) => {
  console.log('uncaughtException', err, origin);
});
process.on('unhandledRejection', (reason) => {
  console.log('unhandledRejection', reason);
});

const main = async () => {
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

  // Note: register all tests by loading all test files and running global side effects
  await Promise.all(
    testFileUrls.map(async (testFileUrl) => {
      await import(testFileUrl);
      // console.log('loaded', testFileUrl);
    })
  );

  // Note: run tests
  await runner();

  // TODO: report test results
  // TODO: report coverage
  // TODO: report delta coverage compared to base branch
};

main()
  .then(() => console.log('testrunner: done'))
  .catch(console.error);
