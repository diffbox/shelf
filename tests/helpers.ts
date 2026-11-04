import { createSession } from "../src/auth/session.js";
import { db, newId, reset, type User } from "../src/db.js";
import type { Request } from "../src/http.js";
import { dispatch } from "../src/router.js";
import "../src/routes/books.js";
import "../src/routes/users.js";

export function seedUser(overrides: Partial<User> = {}): User {
  const user = { id: newId("usr"), email: "ada@example.com", name: "Ada", isAdmin: false, createdAt: new Date("2026-01-05"), ...overrides };
  db.users.set(user.id, user);
  return user;
}

export function call(method: string, path: string, opts: { user?: User; body?: unknown } = {}) {
  const headers: Request["headers"] = {};
  if (opts.user) headers.cookie = `shelf_session=${createSession(opts.user.id).id}`;
  return dispatch({ method, path, headers, body: opts.body ?? null });
}

export { reset };
