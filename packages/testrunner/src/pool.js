import { writeFile } from "node:fs/promises";
import * as os from "node:os";

import { Pool, spawn, Worker } from "threads";

/** @typedef {import('./report-event.js').ReportEvent} ReportEvent */

/**
 * @param {string[]} testFilePaths
 * @param {(event: ReportEvent) => void} report
 */
export default async function (testFilePaths, report) {
  const concurrency = os.cpus().length;
  const pool = Pool(() => spawn(new Worker("./worker.js")), concurrency);
  await Promise.all(
    testFilePaths.map(async (testFilePath) => {
      // @ts-ignore
      const task = async (worker) => {
        return new Promise((resolve) => {
          const observable = worker([testFilePath]);
          /** @type {(event: ReportEvent)=>void} */
          const onEvent = (event) => {
            report(event);
            if (event.scope === "file" && event.type === "done") {
              const testResult = event.data;
              resolve(testResult);
            }
            // TODO: reject on error
            // TODO: collect
          };
          observable.subscribe(onEvent);
        });
      };
      const { deps } = await pool.queue(task);
      if (deps) {
        // TODO: consider excluding tinypool and testrunner from deps
        // TODO: consider keeping .deps file in a .deps directory to keep source dir tidy
        const depFilePath = `${testFilePath}.deps`;
        await writeFile(depFilePath, deps.join("\n"));
      }
    })
  );
  await pool.terminate();
  return { concurrency };
}
