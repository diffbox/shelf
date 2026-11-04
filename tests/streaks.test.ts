import { describe, expect, it } from "vitest";
import { longestStreak, weekOf, weeklyStreak } from "../src/goals/streaks.js";

const finished = (...dates: string[]) => dates.map((d) => ({ finishedAt: new Date(d) }));

describe("streaks", () => {
  it("numbers weeks from Monday", () => {
    expect(weekOf(new Date("2026-11-02T00:00:00Z"))).toBe(weekOf(new Date("2026-11-08T23:59:59Z")));
    expect(weekOf(new Date("2026-11-09T00:00:00Z"))).toBe(weekOf(new Date("2026-11-02T00:00:00Z")) + 1);
  });

  it("counts consecutive weeks ending this week", () => {
    const books = finished("2026-10-20", "2026-10-28", "2026-11-04");
    expect(weeklyStreak(books, new Date("2026-11-05"))).toBe(3);
  });

  it("keeps a streak alive until the week after the last book ends", () => {
    const books = finished("2026-10-28");
    expect(weeklyStreak(books, new Date("2026-11-05"))).toBe(1);
    expect(weeklyStreak(books, new Date("2026-11-12"))).toBe(0);
  });

  it("finds the longest streak", () => {
    expect(longestStreak(finished("2026-01-05", "2026-01-12", "2026-03-02", "2026-03-09", "2026-03-16"))).toBe(3);
  });
});
