#!/usr/bin/env node

import process from "node:process";

import main from "./main.js";

process.on("beforeExit", (code) => {
  // Note: diagnostic for dead promises: https://github.com/nodejs/node/issues/22088#issuecomment-732451617
  console.error("Unexpected exit", code);
});
process.on("uncaughtException", (err, origin) => {
  console.log("uncaughtException", err, origin);
});
process.on("unhandledRejection", (reason) => {
  console.log("unhandledRejection", reason);
});

try {
  const testFilePaths = process.argv.slice(2);
  const concurrent = true; // TODO: configure
  const { failureCount, concurrency, msDuration } = await main(
    testFilePaths,
    concurrent
  );
  console.log(`Completed in ${msDuration} ms with concurrency ${concurrency}`);
  if (failureCount === 0) {
    console.log(`✔ testrunner: all ${testFilePaths.length} tests passed`);
  } else {
    console.error(`x testrunner: ${failureCount} failing tests`);
  }
  process.exit(failureCount);
} catch (ex) {
  console.error(ex);
  process.exit(1);
}
