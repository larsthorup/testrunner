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
  const testFilePattern = process.argv[2];
  const skipUnaffected = process.argv[3] === "--skip-unaffected";
  const testFilePaths = await main(testFilePattern, skipUnaffected);
  testFilePaths.forEach((path) => console.log(path));
  process.exit(0);
} catch (ex) {
  console.error(ex);
  process.exit(1);
}
