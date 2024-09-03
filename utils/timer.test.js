import { timer } from "./timer.js";
import { ONE_SECOND } from "../constants.js";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe("timer()", () => {
  it("should return the time in milliseconds", async () => {
    const t = timer();
    t.start();
    await sleep(ONE_SECOND);
    const delta = t.getDeltaInMilliseconds();
    expect(delta).toBeGreaterThanOrEqual(ONE_SECOND);
  });

  it("should return the time in seconds", async () => {
    const t = timer();
    t.start();
    await sleep(ONE_SECOND);
    const delta = t.getDeltaInSeconds();
    expect(delta).toBeGreaterThanOrEqual(1);
  });

  it("should reset the timer", async () => {
    const t = timer();
    t.start();
    await sleep(ONE_SECOND);
    t.reset();
    const delta = t.getDeltaInMilliseconds();
    expect(delta).toBeLessThan(ONE_SECOND);
  });
});
