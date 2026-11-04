import { beforeEach, describe, expect, it } from "vitest";
import { yearElapsed } from "../src/goals/goals.js";
import { call, reset, seedUser } from "./helpers.js";

describe("reading goals", () => {
  beforeEach(reset);

  it("sets a goal and reports progress", async () => {
    const user = seedUser();
    const res = await call("PUT", "/goals/2026", { user, body: { target: 24 } });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ year: 2026, target: 24, finished: 0, remaining: 24 });
  });

  it("rejects silly targets", async () => {
    const user = seedUser();
    await expect(call("PUT", "/goals/2026", { user, body: { target: 0 } })).rejects.toThrow();
  });

  it("measures how much of the year has passed", () => {
    expect(yearElapsed(2026, new Date("2026-01-01T00:00:00Z"))).toBe(0);
    expect(yearElapsed(2026, new Date("2027-03-01T00:00:00Z"))).toBe(1);
  });
});
