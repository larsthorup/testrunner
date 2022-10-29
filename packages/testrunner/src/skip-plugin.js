import { skip } from "./index.js";

/** @typedef { import('./index.js').Test } Test */

export default () => ({
  /**
   * @param { Test } test
   */
  visitBeforeChildren: (test) => {
    switch (test.type) {
      case "describe":
        if (test.options.skip) {
          for (const subTest of test.testList) {
            if (subTest.type === "describe" || subTest.type === "it") {
              subTest.options.skip = true;
            }
          }
        }
        break;
      case "it":
        if (test.options.skip) {
          test.fn = skip;
        }
        break;
    }
  },
  visitAfterChildren: () => {
    // TODO: skip hooks if all tests are skipped?
  },
});
