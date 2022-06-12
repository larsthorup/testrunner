#!/usr/bin/env node

import { pathToFileURL } from 'node:url';
import { promisify } from 'node:util';

import glob from 'glob';

import { runner } from './index.js';

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
  await Promise.all(testFileUrls.map((testFileUrl) => import(testFileUrl)));

  // Note: run tests
  await runner();

  // TODO: report test results
  // TODO: report coverage
  // TODO: report delta coverage compared to base branch

  console.log('testrunner: done');
};

main().catch(console.error);
