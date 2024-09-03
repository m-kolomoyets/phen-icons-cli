import { ONE_SECOND } from "../constants.js";

/**
 * ## Timer factory
 * #### Initial value - timestamp of the moment the `start()` function is called
 * @returns {{start: () => number, getDeltaInMilliseconds: () => number, getDeltaInSeconds: () => number, reset: () => number;}} callbacks to manage time
 */
export const timer = () => {
  let startTime;

  const start = () => {
    startTime = performance.now();
    return startTime;
  };

  const getDeltaInMilliseconds = () => {
    return performance.now() - startTime;
  };

  const getDeltaInSeconds = () => {
    return getDeltaInMilliseconds() / ONE_SECOND;
  };

  const reset = () => {
    startTime = performance.now();
    return startTime;
  };

  return {
    start,
    getDeltaInMilliseconds,
    getDeltaInSeconds,
    reset,
  };
};
