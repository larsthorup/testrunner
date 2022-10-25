import { runner } from "./runner.js";
import { collector } from "./collector.js";

/** @typedef {import('./report-event.js').ReportEvent} ReportEvent */

const globalWithTrace =
  /** @type {{__esmTrace__: {url: string; parent: string}[] | undefined}} */ (
    /** @type {unknown} */ (global)
  );

/**
 * @param {string[]} testFilePaths
 * @param {(event: ReportEvent) => void} report
 */
export default async (testFilePaths, report) => {
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
    type: "done",
    data: { deps },
  });
};
