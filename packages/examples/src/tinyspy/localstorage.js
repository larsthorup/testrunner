const localstorage = {
  /**
   * @param {string} key
   * @returns {string}
   */
  get: (key) => {
    console.log("get", { key });
    return "tbd";
  },
  /**
   * @param {string} key
   * @param {string} value
   */
  set: (key, value) => {
    console.log("set", { key, value });
  },
  /**
   * @param {string} key
   */
  remove: (key) => {
    console.log("remove", { key });
  },
};

export default localstorage;
