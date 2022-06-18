/**
 * @function
 * @template T
 * @param {() => (() => T)} setup
 * @returns () => T
 */
export const useSetup = (setup) => {
  return setup();
};
