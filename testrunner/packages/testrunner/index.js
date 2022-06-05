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

export const runner = () => {
  run(globalTest, []);
  // TODO: stats
}

const run = (test, parentTestList) => {
  for (const childTest of test.testList) {
    const { type } = childTest;
    const fullTestList = parentTestList.concat([childTest]);
    switch (type) {
      case 'describe':
        run(childTest, fullTestList);
        break;
      case 'it':
        const fullName = fullTestList.map(({ name }) => name).join(' - ');
        const { fn } = childTest;
        // console.log('before', fullName);
        try {
          fn();
          console.log('✔', fullName)
        } catch (ex) {
          console.log('x', fullName, ex.message)
        }
        // console.log('after', fullName);
        break;
    }
  }
}