const globalDescribe = { type: 'describe', tests: [] };
const tests = [globalDescribe];
let currentDescribe = globalDescribe;

export const describe = (name, fn) => {
  console.log('describe', name);
  const describe = { type: 'describe', name, tests: [] };
  currentDescribe.tests.push(describe);
  const previousDescribe = currentDescribe;
  currentDescribe = describe;
  fn();
  currentDescribe = previousDescribe;
};

export const it = (name, fn) => {
  console.log('it', name);
  const it = { type: 'it', name, fn };
  currentDescribe.tests.push(it);
};

export const runner = () => {
  // TODO: iterate
  const describe = globalDescribe.tests[0];
  const it = describe.tests[0];
  const { name, fn } = it;
  console.log('before', describe.name, name);
  try {
    fn();
    console.log('pass', describe.name, name)
  } catch (ex) {
    console.log('fail', describe.name, name, ex.message)
  }
  console.log('after', describe.name, name);
}