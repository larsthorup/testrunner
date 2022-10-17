import { runner } from "./runner.js";
import { collector } from "./collector.js";

const globalWithTrace =
  /** @type {{__esmTrace__: {url: string; parent: string}[] | undefined}} */ (
    /** @type {unknown} */ (global)
  );

/**
 * @param {string[]} testFilePaths
 */
export default async (testFilePaths) => {
  // Note: collect all tests by loading all test files and running global side effects
  const root = await collector(testFilePaths);

  // Note: run tests
  const failureCount = await runner(root);

  // TODO: extract to function in esm-tracer
  const deps = Object.keys(
    (globalWithTrace.__esmTrace__ || []).reduce(
      (deps, { parent }) => ({ ...deps, [parent]: true }),
      {}
    )
  );

  return { deps, failureCount };
};
