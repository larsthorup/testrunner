import { pathToFileURL } from "node:url";

/** @typedef { import('./collector.js').AfterAll } AfterAll */
/** @typedef { import('./collector.js').AfterEach } AfterEach */
/** @typedef { import('./collector.js').BeforeAll } BeforeAll */
/** @typedef { import('./collector.js').BeforeEach } BeforeEach */
/** @typedef { import('./collector.js').Describe } Describe */
/** @typedef { import('./collector.js').DescribeOptions } DescribeOptions */
/** @typedef { import('./collector.js').Fn  } Fn */
/** @typedef { import('./collector.js').It } It */
/** @typedef { import('./collector.js').ItOptions } ItOptions */
/** @typedef { import('./collector.js').Test } Test */

/** @type { Describe } */
let currentDescribe;

/**
 * @param {string | Fn} nameOrFn
 * @param {Fn | undefined} [fnOrUndefined]
 */
export const afterAll = (nameOrFn = "afterAll", fnOrUndefined = undefined) => {
  const name = typeof nameOrFn === "string" ? nameOrFn : "afterAll";
  const fn =
    typeof nameOrFn === "function"
      ? nameOrFn
      : fnOrUndefined !== undefined
      ? fnOrUndefined
      : () => {};
  /** @type { AfterAll } */
  const afterAll = { type: "afterAll", name, fn };
  currentDescribe.testList.push(afterAll);
};

/**
 * @param {string | Fn} nameOrFn
 * @param {Fn | undefined} [fnOrUndefined]
 */
export const afterEach = (
  nameOrFn = "afterEach",
  fnOrUndefined = undefined
) => {
  const name = typeof nameOrFn === "string" ? nameOrFn : "afterEach";
  const fn =
    typeof nameOrFn === "function"
      ? nameOrFn
      : fnOrUndefined !== undefined
      ? fnOrUndefined
      : () => {};
  /** @type { AfterEach } */
  const afterEach = { type: "afterEach", name, fn };
  currentDescribe.testList.push(afterEach);
};

/**
 * @param {string | Fn} nameOrFn
 * @param {Fn | undefined} [fnOrUndefined]
 */
export const beforeAll = (
  nameOrFn = "beforeAll",
  fnOrUndefined = undefined
) => {
  const name = typeof nameOrFn === "string" ? nameOrFn : "beforeAll";
  const fn =
    typeof nameOrFn === "function"
      ? nameOrFn
      : fnOrUndefined !== undefined
      ? fnOrUndefined
      : () => {};
  /** @type { BeforeAll } */
  const beforeAll = { type: "beforeAll", name, fn };
  currentDescribe.testList.push(beforeAll);
};

/**
 * @param {string | Fn} nameOrFn
 * @param {Fn | undefined} [fnOrUndefined]
 */
export const beforeEach = (
  nameOrFn = "beforeEach",
  fnOrUndefined = undefined
) => {
  const name = typeof nameOrFn === "string" ? nameOrFn : "beforeEach";
  const fn =
    typeof nameOrFn === "function"
      ? nameOrFn
      : fnOrUndefined !== undefined
      ? fnOrUndefined
      : () => {};
  /** @type { BeforeEach } */
  const beforeEach = { type: "beforeEach", name, fn };
  currentDescribe.testList.push(beforeEach);
};

/**
 * @param {string} name
 * @param {DescribeOptions | Fn | undefined} [optionsOrFn]
 * @param {() => void | undefined} [fnOrUndefined]
 */
export const describe = (name, optionsOrFn, fnOrUndefined) => {
  const options = typeof optionsOrFn === "object" ? optionsOrFn : {};
  const fn =
    typeof optionsOrFn === "function"
      ? optionsOrFn
      : fnOrUndefined || (() => {});
  /** @type { Describe} */
  const describe = { type: "describe", name, options, testList: [] };
  currentDescribe.testList.push(describe);
  const previousTest = currentDescribe;
  currentDescribe = describe;
  fn();
  currentDescribe = previousTest;
};

/**
 * @param {string} name
 * @param {ItOptions | Fn} optionsOrFn
 * @param {Fn | undefined} fnOrUndefined
 */
export const it = (name, optionsOrFn, fnOrUndefined) => {
  const options = typeof optionsOrFn === "object" ? optionsOrFn : {};
  const fn =
    typeof optionsOrFn === "function"
      ? optionsOrFn
      : fnOrUndefined || (() => {});
  /** @type { It} */
  const it = { type: "it", name, fn, options };
  currentDescribe.testList.push(it);
};

/**
 * @param {string[]} filePaths
 * @returns {Promise<Describe>}
 */
export const fileCollector = async (filePaths) => {
  // /** @type { Describe } */
  return scopeCollector(async () => {
    const fileUrls = filePaths.map((filePath) => pathToFileURL(filePath).href);
    await Promise.all(
      fileUrls.map(async (fileUrl) => {
        await import(fileUrl);
      })
    );
  });
};

/**
 * @param {() => void | Promise<void>} block
 * @returns {Promise<Describe>}
 */
export const scopeCollector = async (block) => {
  /** @type { Describe } */
  const root = { type: "describe", name: "", options: {}, testList: [] };
  currentDescribe = root;
  await Promise.resolve(block());
  return root;
};

export class TestSkipException extends Error {
  /**
   *
   * @param {string} reason
   */
  constructor(reason) {
    super(reason);
  }
}

/**
 *
 * @param {boolean} condition
 * @param {string | undefined} [reason]
 */
export const skipIf = (condition, reason) => {
  if (condition) throw new TestSkipException(reason || "");
};
