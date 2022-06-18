/** @typedef { import("@larsthorup/testrunner").Fn } Fn */

/**
 * @param {Fn} fn
 * @param {number} ms
 * @returns Fn
 */
export const timeout =
  (fn, ms = 2000) =>
  () => {
    // Note: inspired by https://github.com/lukeed/uvu/issues/33
    /** @type NodeJS.Timeout */
    let timer;
    return Promise.race([
      fn(),
      new Promise((_, reject) => {
        timer = setTimeout(
          () =>
            reject(new Error(`Expected to settle within ${ms} ms but didn't`)),
          ms
        );
      }),
    ]).finally(() => {
      clearTimeout(timer);
    });
  };
