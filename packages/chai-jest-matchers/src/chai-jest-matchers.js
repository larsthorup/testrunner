/** @typedef { import('./chai.js').Assertion } Assertion */
/** @typedef { import('./chai.js').ChaiExpectReturn } ChaiExpectReturn */
/** @typedef { import('./chai.js').ChaiPlugin } ChaiPlugin */

/** @type { ChaiPlugin } */
const ChaiJestMatchers = (chai, utils) => {
  utils.addMethod(
    chai.Assertion.prototype,
    "toHaveLength",
    /**
     * @this {Assertion & ChaiExpectReturn}
     * @param {number} length
     * @returns
     */
    function (length) {
      return this.have.length(length);
    }
  );

  utils.addMethod(
    chai.Assertion.prototype,
    "toBe",
    /**
     * @this {Assertion & ChaiExpectReturn}
     * @param {any} value
     * @returns
     */
    function (value) {
      return this.to.equal(value);
    }
  );

  utils.addMethod(
    chai.Assertion.prototype,
    "toEqual",
    /**
     * @this {Assertion & ChaiExpectReturn}
     * @param {any} value
     * @returns
     */
    function (value) {
      return this.to.deep.equal(value);
    }
  );
};

export default ChaiJestMatchers;
