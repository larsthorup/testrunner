import { strict as assert } from 'node:assert';
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  it,
} from '@larsthorup/testrunner';

describe('outer', () => {
  let order = '';

  beforeAll(() => {
    order += 'B';
  });

  it('outer first', () => {
    assert.equal(2 + 2, 4);
    order += '1';
  });

  describe('inner', () => {
    beforeEach(() => {
      order += 'b';
    });

    it('inner first', () => {
      assert.equal(2 + 2, 4);
      order += '2';
    });

    it('inner last', () => {
      assert.equal(2 + 2, 4);
      order += '3';
    });

    afterEach(() => {
      order += 'a';
    });
  });

  it('outer last', () => {
    assert.equal(2 + 2, 4);
    order += '4';
  });

  afterAll(() => {
    order += 'A';
    assert.equal(order, 'B1b2ab3a4A');
  });
});

describe('async', () => {
  it('should await', async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    assert.equal(2 + 2, 4);
  });
});

describe('hooks run FILO', () => {
  let order = '';
  describe('block', () => {
    beforeAll(() => {
      order += 'B';
    });
    afterAll(() => {
      order += 'A';
    });
    beforeAll(() => {
      order += 'D';
    });
    afterAll(() => {
      order += 'C';
    });
    it('should run all hooks', () => {
      order += 'i';
    });
  });
  afterAll(() => {
    assert.equal(order, 'BDiCA');
  });
});
