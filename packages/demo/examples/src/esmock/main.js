import { getPostTitle } from "./lib.js";

if (!process.env.IS_TEST) {
  getPostTitle(2).then(console.log).catch(console.error);
}
