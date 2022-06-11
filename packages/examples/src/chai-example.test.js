import { expect } from 'chai';
import { describe, it } from '@larsthorup/testrunner';

describe('chai', () => {
  it('should expect actual to match expected', () => {
    expect(2 + 2).to.equal(4);
  });
});
