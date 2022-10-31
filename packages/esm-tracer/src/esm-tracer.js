const globalWithTrace =
  /** @type {{__esmTrace__: {url: string; parent: string}[]}} */ (
    /** @type {unknown} */ (global)
  );
globalWithTrace.__esmTrace__ = [];

/** @typedef {{parentURL: string}} Context */
/** @typedef {{format: string; shortCircuit: boolean; url: string}} Resolution */

/**
 * @param {string} specifier
 * @param {Context} context
 * @param {(specifier: string, context: Context) => Promise<Resolution> } nextResolve
 * @returns {Promise<Resolution>}
 */
export async function resolve(specifier, context, nextResolve) {
  const { parentURL: parent } = context;
  const resolution = await nextResolve(specifier, context);
  const { format, url } = resolution;
  if (format === "module" && parent) {
    globalWithTrace.__esmTrace__.push({ url, parent });
  }
  return resolution;
}
