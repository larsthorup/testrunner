const globalTest = { type: 'describe', testList: [] };
let currentTest = globalTest;

export const describe = (name, fn) => {
  // console.log('describe', name);
  const describe = { type: 'describe', name, testList: [] };
  currentTest.testList.push(describe);
  const previousTest = currentTest;
  currentTest = describe;
  fn();
  currentTest = previousTest;
};

export const it = (name, fn) => {
  // console.log('it', name);
  const it = { type: 'it', name, fn };
  currentTest.testList.push(it);
};

// TODO: beforeAll, beforeEach, afterAll, afterEach
// TODO: useSetup

export const runner = () => {
  // TODO: instrument for coverage
  run(globalTest, []);
  // TODO: report test results
  // TODO: report coverage
  // TODO: report delta coverage compared to base branch
};

const run = (test, parentTestList) => {
  // TODO: filter tests based on explicit criteria, watched changes, explicit test order
  // TODO: randomize test order or not
  // TODO: parallelism or not
  for (const childTest of test.testList) {
    const { type } = childTest;
    const fullTestList = parentTestList.concat([childTest]);
    switch (type) {
      case 'describe':
        run(childTest, fullTestList);
        break;
      case 'it':
        {
          const fullName = fullTestList.map(({ name }) => name).join(' - ');
          const { fn } = childTest;
          // console.log('before', fullName);
          try {
            // TODO: run in browser or node
            // TODO: process isolation or not
            // TODO: wait for promise
            // TODO: pass in test context
            fn();
            console.log('✔', fullName);
          } catch (ex) {
            // TODO: pluggable reporter
            console.log('x', fullName, ex.message);
          }
          // console.log('after', fullName);
        }
        break;
    }
  }
};
