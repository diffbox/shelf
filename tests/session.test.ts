import { beforeEach, describe, expect, it } from "vitest";
import { call, reset, seedUser } from "./helpers.js";

describe("sessions", () => {
  beforeEach(reset);

  it("signs in by email and sets a secure cookie", async () => {
    seedUser();
    const res = await call("POST", "/sessions", { body: { email: "ADA@example.com " } });
    expect(res.status).toBe(201);
    expect(res.headers?.["set-cookie"]).toMatch(/HttpOnly; Secure; SameSite=Lax/);
  });

  it("rejects unknown emails", async () => {
    await expect(call("POST", "/sessions", { body: { email: "nobody@example.com" } })).rejects.toThrow("Unknown email");
  });
});
