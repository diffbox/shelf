// A tiny in-memory store with the same shape as the SQL schema in migrations/.
// Good enough for development and tests; swap for a real driver in production.

export type User = { id: string; email: string; name: string; isAdmin: boolean; createdAt: Date };
export type Book = {
  id: string;
  userId: string;
  title: string;
  author: string;
  slug: string;
  pages: number | null;
  finishedAt: Date | null;
  createdAt: Date;
};
export type Session = { id: string; userId: string; expiresAt: Date };

export const db = {
  users: new Map<string, User>(),
  books: new Map<string, Book>(),
  sessions: new Map<string, Session>(),
};

export function newId(prefix: string) {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`;
}

export function booksFor(userId: string) {
  return [...db.books.values()].filter((b) => b.userId === userId);
}

export function reset() {
  db.users.clear();
  db.books.clear();
  db.sessions.clear();
}
