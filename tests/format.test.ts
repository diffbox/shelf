import { describe, expect, it } from "vitest";
import { formatDay, pluralize } from "../src/lib/format.js";
import { slugify } from "../src/lib/slug.js";

describe("format", () => {
  it("formats dates in UTC", () => {
    expect(formatDay(new Date("2026-11-03T23:30:00Z"))).toBe("3 Nov 2026");
  });

  it("slugifies titles, dropping accents", () => {
    expect(slugify("Cien años de soledad")).toBe("cien-anos-de-soledad");
  });

  it("pluralizes", () => {
    expect(pluralize(1, "book")).toBe("1 book");
    expect(pluralize(3, "book")).toBe("3 books");
  });
});
