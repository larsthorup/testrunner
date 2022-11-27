import os from "node:os";
import { Worker } from "node:worker_threads";

import PQueue from "p-queue";

// reporters

/** @typedef { import('./reporter.js').Reporter } Reporter */

/** @type { Reporter } */
function consoleReporter(event) {
  const { type, names, message } = event;
  const fullName = names.join(" - ");
  switch (type) {
    case "error":
      console.log("!", fullName, message);
      break;
    case "failure":
      console.log("x", fullName, message);
      break;
    case "success":
      console.log("✔", fullName);
      break;
  }
}

/**
 * @param {Reporter[]} reporters
 * @returns {Reporter}
 */
const combineReporters = (reporters) => (event) => {
  reporters.forEach((report) => report(event));
};

// spawn a worker thread per test file

const testFiles = process.argv.slice(2);
let failureCount = 0;
/** @type { Reporter } */
const failureAggregator = ({ type }) => {
  if (["failure", "error"].includes(type)) ++failureCount;
};
const reporter = combineReporters([consoleReporter, failureAggregator]);
const concurrency = os.cpus().length;
const queue = new PQueue({ concurrency });
const workerUrl = new URL("./worker.js", import.meta.url);
const threads = [];
for (const path of testFiles) {
  const thread = queue.add(async () => {
    const workerData = path;
    const worker = new Worker(workerUrl, { workerData });
    /** @type {Promise<void>} */
    const result = new Promise((resolve, reject) => {
      worker.on("message", reporter);
      worker.on("error", reject);
      worker.on("exit", (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });
    });
    return result;
  });
  threads.push(thread);
}
await Promise.all(threads);
process.exit(failureCount);
