import EventEmitter from "node:events";

/**
 * @param { number } ms
 * @returns { EventEmitter }
 */
export function createTimer(ms) {
  const timer = new EventEmitter();
  setTimeout(() => timer.emit("ring"), ms);
  return timer;
}
