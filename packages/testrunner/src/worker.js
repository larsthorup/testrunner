import { workerData, parentPort } from "node:worker_threads";

import { loader } from "./loader.js";

const testFilePaths = workerData;

await loader(testFilePaths, (reportEvent) =>
  parentPort?.postMessage(reportEvent)
);
