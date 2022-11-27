/** @typedef { () => void } Fn */
/** @typedef { {type: "it", name: string, fn: Fn} } It */
/** @typedef { {type: "describe", name: string, testList: Test[]} } Describe */
/** @typedef { It | Describe } Test */

/** @type { Describe } */
export const root = { type: "describe", name: "", testList: [] };
let currentDescribe = root;

/**
 * @param { string } name
 * @param { Fn } fn
 */
export function it(name, fn) {
  /** @type { It } */
  const it = { type: "it", name, fn };
  currentDescribe.testList.push(it);
}

/**
 * @param { string } name
 * @param { Fn } fn
 */
export function describe(name, fn) {
  /** @type { Describe } */
  const describe = { type: "describe", name, testList: [] };
  currentDescribe.testList.push(describe);
  const previousDescribe = currentDescribe;
  currentDescribe = describe;
  fn();
  currentDescribe = previousDescribe;
}
