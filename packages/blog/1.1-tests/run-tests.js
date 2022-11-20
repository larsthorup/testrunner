// (1) test runner code

/** @typedef { () => void } Fn */

/** @type { {name: string, fn: Fn}[] } */
const testList = [];

/**
 * @param { string } name
 * @param { Fn } fn
 */
function it(name, fn) {
  testList.push({ name, fn });
}

function run() {
  testList.forEach((test) => test.fn());
}

// (2) code under test

/**
 * @param { number } a
 * @param { number } b
 * @returns { number }
 */
function add(a, b) {
  return a + b;
}

// (3) test code

it("should calculate the sum", () => {
  if (add(2, 2) !== 4) throw new Error();
});

// (4) invoking the test runner

run();
