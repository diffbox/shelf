import { beforeEach, describe, expect, it } from "vitest";
import { call, reset, seedUser } from "./helpers.js";

describe("books", () => {
  beforeEach(reset);

  it("adds a book with a slug", async () => {
    const user = seedUser();
    const res = await call("POST", "/books", { user, body: { title: "The Left Hand of Darkness", author: "Ursula K. Le Guin" } });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ slug: "the-left-hand-of-darkness", finished: null });
  });

  it("lists only your own books", async () => {
    const ada = seedUser();
    const bo = seedUser({ email: "bo@example.com", name: "Bo" });
    await call("POST", "/books", { user: ada, body: { title: "Kindred", author: "Octavia E. Butler" } });
    const res = await call("GET", "/books", { user: bo });
    expect(res.body).toEqual([]);
  });

  it("deletes a book", async () => {
    const ada = seedUser();
    const added = await call("POST", "/books", { user: ada, body: { title: "Piranesi", author: "Susanna Clarke" } });
    const id = (added.body as { id: string }).id;
    expect((await call("DELETE", `/books/${id}`, { user: ada })).status).toBe(204);
  });
});
