import { requireUser } from "../auth/guards.js";
import { createSession, endSession, sessionCookie } from "../auth/session.js";
import { booksFor, db } from "../db.js";
import { created, HttpError, noContent, ok } from "../http.js";
import { formatDay, pluralize } from "../lib/format.js";
import { route } from "../router.js";

route("GET", "/me", (req) => {
  const user = requireUser(req);
  const books = booksFor(user.id);
  return ok({
    id: user.id,
    name: user.name,
    email: user.email,
    joined: formatDay(user.createdAt),
    shelf: pluralize(books.length, 'book'),
    finished: pluralize(books.filter((b) => b.finishedAt).length, 'book')
  });
});

route("POST", "/sessions", (req) => {
  const { email } = (req.body ?? {}) as { email?: string };
  const user = [...db.users.values()].find((u) => u.email === email?.trim().toLowerCase());
  if (!user) throw new HttpError(401, 'Unknown email');
  const session = createSession(user.id);
  return { ...created({ userId: user.id }), headers: { 'set-cookie': sessionCookie(session) } };
});

route("DELETE", "/sessions", (req) => {
  endSession(req);
  return noContent();
});
