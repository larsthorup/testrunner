/** @typedef { import('./index.js').Test } Test */

export default () => {
  let hasOnly = false;
  return {
    /**
     * @param { Test } test
     */
    preVisit: (test) => {
      if ((test.type === "describe" || test.type === "it") && test.options.only)
        hasOnly = true;
    },
    /**
     * @param { Test } test
     */
    visitBeforeChildren: (test) => {
      if (hasOnly) {
        switch (test.type) {
          case "describe":
            {
              // Note: "only" on a parent automatically applies to all children
              if (test.options.only) {
                for (const subTest of test.testList) {
                  if (subTest.type === "describe" || subTest.type === "it") {
                    subTest.options.only = true;
                  }
                }
              }
            }
            break;
        }
      }
    },
    /**
     * @param { Test } test
     */
    visitAfterChildren: (test) => {
      if (hasOnly) {
        switch (test.type) {
          case "describe":
            {
              // Note: siblings without "only" are removed (not skipped, to avoid the noise)
              test.testList = test.testList.filter(
                (test) =>
                  (test.type === "describe" || test.type === "it") &&
                  test.options.only
              );
              // Note: "only" on a child automatically applies to all parents
              if (test.testList.length > 0) {
                test.options.only = true;
              }
            }
            break;
        }
      }
    },
  };
};
