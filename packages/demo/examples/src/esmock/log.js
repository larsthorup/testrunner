import { appendFile } from "node:fs/promises";

/**
 * @param {string} msg
 * @returns {Promise<void>}
 */
export const log = async (msg) => appendFile("log.log", `LOG ${msg}\n`);
