import { requireAdmin, requireUser } from "../auth/guards.js";
import { booksFor, db, newId } from "../db.js";
import { created, HttpError, noContent, ok } from "../http.js";
import { formatDay } from "../lib/format.js";
import { slugify } from "../lib/slug.js";
import { validateBook } from "../lib/validate.js";
import { route } from "../router.js";

const view = (b: {
  id: string;
  title: string;
  author: string;
  slug: string;
  pages: number | null;
  finishedAt: Date | null;
}) => ({
  id: b.id,
  title: b.title,
  author: b.author,
  slug: b.slug,
  pages: b.pages,
  finished: b.finishedAt ? formatDay(b.finishedAt) : null,
});

route("GET", "/books", (req) => {
  const user = requireUser(req);
  return ok(booksFor(user.id).map(view));
});

route("POST", "/books", (req) => {
  const user = requireUser(req);
  const input = validateBook(req.body);
  const book = {
    id: newId("bk"),
    userId: user.id,
    ...input,
    slug: slugify(input.title),
    finishedAt: null,
    createdAt: new Date(),
  };
  db.books.set(book.id, book);
  return created(view(book));
});

route("POST", "/books/:id/finish", (req) => {
  const user = requireUser(req);
  const book = db.books.get(req.params.id);
  if (!book || book.userId !== user.id) throw new HttpError(404, "No such book");
  book.finishedAt = new Date();
  return ok(view(book));
});

route("DELETE", "/books/:id", (req) => {
  requireAdmin(req);
  if (!db.books.delete(req.params.id)) throw new HttpError(404, "No such book");
  return noContent();
});
