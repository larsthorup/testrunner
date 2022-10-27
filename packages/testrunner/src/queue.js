import { Worker } from "node:worker_threads";

import PQueue from "p-queue";

/** @typedef {import('./report-event.js').ReportEvent} ReportEvent */

/**
 *
 * @param {number} concurrency
 */
export function createQueue(concurrency) {
  return new PQueue({ concurrency });
}

/**
 * @param {PQueue} queue
 * @param {URL} url
 * @param {unknown} workerData
 * @param {(event: ReportEvent) => void} report
 * @author https://github.com/andywer/threads.js/issues/434#issuecomment-1279452154
 */
export async function runWorker(queue, url, workerData, report) {
  return queue.add(async () => {
    const worker = new Worker(url, { workerData });

    const result = await /** @type {Promise<void>} */ (
      new Promise((resolve, reject) => {
        worker.on("message", report);
        worker.on("error", reject);
        worker.on("exit", (code) => {
          if (code === 0) {
            resolve();
          } else {
            reject(new Error(`Worker stopped with exit code ${code}`));
          }
        });
      })
    );
    return result;
  });
}
