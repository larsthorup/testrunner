import { expect, test } from '@playwright/test';
import { forTimeout } from './lib/forTimeout.js';

test.describe('outer', () => {
  let order = '';

  test.beforeAll(() => {
    order += '<';
  });

  test('outer first', () => {
    expect(2 + 2).toEqual(4);
    order += '1';
  });

  test.describe('inner', () => {
    test.beforeEach(() => {
      order += '(';
    });

    test('inner first', () => {
      expect(2 + 2).toEqual(4);
      order += '2';
    });

    test('inner last', () => {
      expect(2 + 2).toEqual(4);
      order += '3';
    });

    test.afterEach(() => {
      order += ')';
    });
  });

  test('outer last', () => {
    expect(2 + 2).toEqual(4);
    order += '4';
  });

  test.afterAll(() => {
    order += '>';
    expect(order).toEqual('<1(2)(3)4>');
  });
});

test.describe('async', () => {
  test('should await', async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(2 + 2).toEqual(4);
  });
  test.skip('should timeout', async () => {
    test.setTimeout(50);
    return new Promise(() => {});
  });
});

test.describe('sync hooks run FIFO', () => {
  let order = '';
  test.describe('block', () => {
    test.beforeAll(() => {
      order += '<';
    });
    test.afterAll(() => {
      order += '>';
    });
    test.beforeAll(() => {
      order += '(';
    });
    test.afterAll(() => {
      order += ')';
    });
    test('should run all hooks', () => {
      order += '1';
    });
  });
  test.afterAll(() => {
    expect(order).toEqual('<(1>)');
  });
});

test.describe('async hooks run sequentially', () => {
  let order = '';
  test.describe('block', () => {
    test.beforeAll(async () => {
      await forTimeout(20);
      order += '<';
      await forTimeout(50);
      order += '(';
    });
    test.beforeAll(async () => {
      order += '[';
      await forTimeout(50);
      order += '{';
    });
    test.afterAll(async () => {
      await forTimeout(20);
      order += ')';
      await forTimeout(50);
      order += '>';
    });
    test.afterAll(async () => {
      order += '}';
      await forTimeout(50);
      order += ']';
    });
    test('should run all hooks', () => {
      order += 'i';
    });
  });
  test.afterAll(() => {
    expect(order).toEqual('<([{i)>}]');
  });
});

test.describe('mark test expected to fail', () => {
  test.fail('should fail', () => {
    expect(2 + 2).toEqual(5);
  });

  // mark test expected to fail with specific message - not available in vitest
});

test.describe('skip', () => {
  test('should allow a test to bail out', () => {
    test.skip();
    expect(2 + 2).toEqual(5);
  });
});
