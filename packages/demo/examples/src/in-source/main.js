import process from "node:process";
import { add } from "./lib.js";

const a = 2;
const b = 2;

if (!process.env.IS_TEST) {
  console.log(`${a} + ${b} is ${add(a, b)}`);
}
