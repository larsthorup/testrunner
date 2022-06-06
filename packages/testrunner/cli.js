#!/usr/bin/env node

import { runner } from './index.js';

// TODO: use glob arg to find test files
// TODO: multiple test files
import '../examples/example.test.js';
runner();
console.log("testrunner: done");