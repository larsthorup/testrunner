#!/usr/bin/env node

import { runner } from './index.js';

// TODO: use glob arg to find test files
// TODO: multiple test files
import '../examples/example.test.js';

const main = async () => {
  // TODO: use watcher to provide additional test filter
  // TODO: instrument for coverage
  // TODO: run in browser or node
  // TODO: tab / process / worker isolation or not
  await runner();
  // TODO: report test results
  // TODO: report coverage
  // TODO: report delta coverage compared to base branch
  console.log('testrunner: done');
};

main().catch(console.error);
