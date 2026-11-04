import { booksFor, db, newId, type Goal } from "../db.js";
import { HttpError } from "../http.js";
import { longestStreak, weeklyStreak } from "./streaks.js";

export type GoalProgress = {
  year: number;
  target: number;
  finished: number;
  /** Books still to read to hit the target. */
  remaining: number;
  /** Whether the reader is at or ahead of an even pace through the year. */
  onTrack: boolean;
  streak: { current: number; longest: number };
};

export function setGoal(userId: string, year: number, target: number): Goal {
  const existing = [...db.goals.values()].find((g) => g.userId === userId && g.year === year);
  if (existing) {
    existing.target = target;
    return existing;
  }
  const goal = { id: newId("goal"), userId, year, target, createdAt: new Date() };
  db.goals.set(goal.id, goal);
  return goal;
}

export function goalFor(userId: string, year: number): Goal {
  const goal = [...db.goals.values()].find((g) => g.userId === userId && g.year === year);
  if (!goal) throw new HttpError(404, `No reading goal for ${year}`);
  return goal;
}

export function progress(userId: string, year: number, now = new Date()): GoalProgress {
  const goal = goalFor(userId, year);
  const books = booksFor(userId);
  const finished = books.filter((b) => b.finishedAt?.getUTCFullYear() === year).length;
  return {
    year,
    target: goal.target,
    finished,
    remaining: Math.max(0, goal.target - finished),
    onTrack: finished >= goal.target * yearElapsed(year, now),
    streak: { current: weeklyStreak(books, now), longest: longestStreak(books) },
  };
}

/** How much of `year` has passed at `now`, from 0 to 1. */
export function yearElapsed(year: number, now: Date) {
  const start = Date.UTC(year, 0, 1);
  const end = Date.UTC(year + 1, 0, 1);
  return Math.min(1, Math.max(0, (now.getTime() - start) / (end - start)));
}
