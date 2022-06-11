#!/usr/bin/env node

import { runner } from './index.js';

// TODO: use glob arg to find test files
const testFilePaths = [
  '../../examples/src/example.test.js',
  '../../examples/src/chai-example.test.js',
];

const main = async () => {
  // TODO: use watcher to provide additional test filter
  // TODO: instrument for coverage
  // TODO: run in browser or node
  // TODO: tab / process / worker isolation or not
  await Promise.all(testFilePaths.map((testFilePath) => import(testFilePath)));
  await runner();
  // TODO: report test results
  // TODO: report coverage
  // TODO: report delta coverage compared to base branch
  console.log('testrunner: done');
};

main().catch(console.error);
