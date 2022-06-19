import { expect, use } from 'chai';
import { describe, it } from '@larsthorup/testrunner';
import ChaiJestMatchers from 'chai-jest-matchers';

use(ChaiJestMatchers);

describe('jest matcher', () => {
  it('should expect().toHaveLength()', () => {
    expect([1, 2, 3]).toHaveLength(3);
  });
  it('should still provide chai matchers too', () => {
    expect([1, 2, 3]).to.have.length(3);
  });
});
