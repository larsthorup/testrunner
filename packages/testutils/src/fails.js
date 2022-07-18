import { isPromise } from "node:util/types";

/** @typedef { import("@larsthorup/testrunner").Fn } Fn */

/**
 * @param {string | Fn} expectedOrFn
 * @param {Fn | undefined} [fnOrUndefined]
 */
export const fails = (expectedOrFn, fnOrUndefined) => async () => {
  const expected =
    typeof expectedOrFn !== "function" ? expectedOrFn : undefined;
  const fn =
    typeof expectedOrFn === "function"
      ? expectedOrFn
      : fnOrUndefined !== undefined
      ? fnOrUndefined
      : () => {};
  /** @type { {message: string } | undefined } */
  let actual = undefined;
  try {
    const result = fn();
    if (isPromise(result)) {
      await result;
    }
  } catch (ex) {
    if (ex instanceof Error) {
      actual = ex;
    } else {
      actual = { message: `${ex}` };
    }
  }
  if (!actual) {
    throw new Error(`Expected to fail but didn't`);
  } else if (expected && expected !== actual.message) {
    throw new Error(
      `Expected to fail with message "${expected}" but got "${actual.message}"`
    );
  }
};
