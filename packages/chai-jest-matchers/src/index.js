/** @typedef { import('./chai.js').Assertion } Assertion */
/** @typedef { import('./chai.js').ChaiExpectReturn } ChaiExpectReturn */
/** @typedef { import('./chai.js').ChaiPlugin } ChaiPlugin */

/** @type { ChaiPlugin } */
const ChaiJestMatchers = (chai, utils) => {
  utils.addMethod(
    chai.Assertion.prototype,
    'toHaveLength',
    /**
     * @this {Assertion & ChaiExpectReturn}
     * @param {number} length
     * @returns
     */
    function (length) {
      return this.have.length(length);
    }
  );
};

export default ChaiJestMatchers;
