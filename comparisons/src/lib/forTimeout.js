export const forTimeout = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));
