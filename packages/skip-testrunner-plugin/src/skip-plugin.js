import { skip as raiseSkip } from "@larsthorup/testrunner";

/** @typedef { import('@larsthorup/testrunner').Test } Test */

export const plugin = () => ({
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
          test.fn = raiseSkip;
        }
        break;
    }
  },
  visitAfterChildren: () => {
    // TODO: skip hooks if all tests are skipped?
  },
});

export const skip = Symbol("skip");
