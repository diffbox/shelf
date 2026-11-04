import type { Book } from "../db.js";

const DAY = 24 * 60 * 60 * 1000;

/** Midnight UTC of the day a date falls on, as a day number. */
const dayOf = (date: Date) => Math.floor(date.getTime() / DAY);

/**
 * The reading streak: consecutive weeks, ending this week or last, in which at
 * least one book was finished. Weeks run Monday to Sunday, in UTC.
 */
export function weeklyStreak(books: Pick<Book, "finishedAt">[], now = new Date()): number {
  const weeks = new Set(
    books.flatMap((b) => (b.finishedAt ? [weekOf(b.finishedAt)] : [])),
  );
  let week = weekOf(now);
  // A streak survives until the end of the week after its last book.
  if (!weeks.has(week)) week -= 1;
  let streak = 0;
  while (weeks.has(week)) {
    streak += 1;
    week -= 1;
  }
  return streak;
}

/** Weeks since 1970-01-05, the first Monday of the Unix epoch. */
export function weekOf(date: Date) {
  return Math.floor((dayOf(date) - 4) / 7);
}

/** The longest run of consecutive weeks with a finished book, ever. */
export function longestStreak(books: Pick<Book, "finishedAt">[]): number {
  const weeks = [...new Set(books.flatMap((b) => (b.finishedAt ? [weekOf(b.finishedAt)] : [])))].sort((a, b) => a - b);
  let best = 0;
  let run = 0;
  for (let i = 0; i < weeks.length; i++) {
    run = i > 0 && weeks[i] === weeks[i - 1] + 1 ? run + 1 : 1;
    best = Math.max(best, run);
  }
  return best;
}
