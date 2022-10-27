import { pathToFileURL } from "node:url";

/** @typedef { { type: 'afterAll'; name: string;  fn: Fn} } AfterAll */
/** @typedef { { type: 'afterEach'; name: string; fn: Fn } } AfterEach */
/** @typedef { { type: 'beforeAll'; name: string;  fn: Fn} } BeforeAll */
/** @typedef { { type: 'beforeEach'; name: string;  fn: Fn} } BeforeEach */
/** @typedef { { type: 'describe'; name: string; testList: Test[] } } Describe */
/** @typedef { () => Promise<any> | void  } Fn */
/** @typedef { { type: 'it'; name: string; fn: Fn } } It */
/** @typedef { AfterAll | AfterEach | BeforeAll | BeforeEach | Describe | It } Test */

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
 * @param {Fn} fn
 */
export const afterEach = (fn) => {
  /** @type { AfterEach } */
  const afterEach = { type: "afterEach", name: "afterEach", fn };
  currentDescribe.testList.push(afterEach);
};

/**
 * @param {Fn} fn
 */
export const beforeAll = (fn) => {
  /** @type { BeforeAll } */
  const beforeAll = { type: "beforeAll", name: "beforeAll", fn };
  currentDescribe.testList.push(beforeAll);
};

/**
 * @param {Fn} fn
 */
export const beforeEach = (fn) => {
  /** @type { BeforeEach } */
  const beforeEach = { type: "beforeEach", name: "beforeEach", fn };
  currentDescribe.testList.push(beforeEach);
};

/**
 * @param {string} name
 * @param {() => void | undefined} [fn]
 */
export const describe = (name, fn) => {
  /** @type { Describe} */
  const describe = { type: "describe", name, testList: [] };
  currentDescribe.testList.push(describe);
  if (fn) {
    const previousTest = currentDescribe;
    currentDescribe = describe;
    fn();
    currentDescribe = previousTest;
  }
};

/**
 * @param {string} name
 * @param {Fn} fn
 */
export const it = (name, fn) => {
  /** @type { It} */
  const it = { type: "it", name, fn };
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
  const root = { type: "describe", name: "", testList: [] };
  currentDescribe = root;
  await Promise.resolve(block());
  return root;
};
