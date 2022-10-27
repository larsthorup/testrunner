import * as fs from "node:fs/promises";
import * as os from "node:os";

import { collector } from "./collector.js";
import { combineReporters } from "./multi-reporter.js";
import { createQueue, runWorker } from "./queue.js";
import { runner } from "./runner.js";

/** @typedef {import('./report-event.js').ReportEvent} ReportEvent */

const globalWithTrace =
  /** @type {{__esmTrace__: {url: string; parent: string}[] | undefined}} */ (
    /** @type {unknown} */ (global)
  );

/**
 * @param {string[]} testFilePaths
 * @param {(event: ReportEvent) => void} report
 */
export async function loader(testFilePaths, report) {
  // Note: collect all tests by loading all test files and running global side effects
  const root = await collector(testFilePaths);

  // Note: run tests
  await runner(root, report);

  // TODO: extract to function in esm-tracer(?)
  const deps =
    globalWithTrace.__esmTrace__ &&
    Object.keys(
      globalWithTrace.__esmTrace__.reduce(
        (deps, { url }) => ({ ...deps, [url]: true }),
        {}
      )
    );
  report({
    scope: "file",
    type: "deps",
    data: { deps },
  });
}

/**
 * @param {string[]} testFilePaths
 * @param {(event: ReportEvent) => void} report
 */
export async function concurrentLoader(testFilePaths, report) {
  const concurrency = os.cpus().length;
  const queue = createQueue(concurrency);
  await Promise.all(
    testFilePaths.map(async (testFilePath) => {
      /**
       * @param {ReportEvent} event
       */
      const depsCollector = async ({ scope, type, data }) => {
        if (scope === "file" && type === "deps") {
          const { deps } = data;
          if (deps) {
            // TODO: consider excluding tinypool and testrunner from deps
            // TODO: consider keeping .deps file in a .deps directory to keep source dir tidy
            const depFilePath = `${testFilePath}.deps`;
            await fs.writeFile(depFilePath, deps.join("\n"));
          }
        }
      };
      const reporters = combineReporters([depsCollector, report]);
      const url = new URL("./worker.js", import.meta.url);
      await runWorker(queue, url, [testFilePath], reporters);
    })
  );
  return { concurrency };
}
