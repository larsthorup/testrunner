/** @typedef { () => void } Fn */

/** @type { {name: string, fn: Fn}[] } */
const testList = [];

/**
 * @param { string } name
 * @param { Fn } fn
 */
function test(name, fn) {
  testList.push({ name, fn });
}

function run() {
  testList.forEach((test) => test.fn());
}

/**
 * @param { number } a
 * @param { number } b
 * @returns { number }
 */
function add(a, b) {
  return a + b;
}

test("that it calculates the sum", () => {
  if (add(2, 2) !== 4) throw new Error();
});

run();
