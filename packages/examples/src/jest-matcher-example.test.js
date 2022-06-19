import { expect, use } from 'chai';
import { describe, it } from '@larsthorup/testrunner';
import ChaiJestMatchers from 'chai-jest-matchers';

use(ChaiJestMatchers);

describe('jest matcher', () => {
  it('should expect().toHaveLength()', () => {
    expect([1, 2, 3]).toHaveLength(3);
  });

  it('should expect().toBe()', () => {
    expect(2).toBe(2);
    expect('abc').toBe('abc');
    expect([1, 2, 3]).not.toBe([1, 2, 3]);
    const list = [1, 2, 3];
    expect(list).toBe(list);
  });

  it('should still provide chai matchers too', () => {
    expect([1, 2, 3]).to.have.length(3);
  });
});
