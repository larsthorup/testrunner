#!/usr/bin/env node

import { runner } from './index.js';

// TODO: use glob arg to find test files
// TODO: multiple test files
import '../examples/example.test.js';

const main = async () => {
  await runner();
  console.log('testrunner: done');
};

main().catch(console.error);
