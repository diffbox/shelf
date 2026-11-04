import { db, type User } from "../db.js";
import { HttpError, type Request } from "../http.js";
import { readSession } from "./session.js";

export function requireUser(req: Request): User {
  const session = readSession(req);
  const user = session && db.users.get(session.userId);
  if (!user) throw new HttpError(401, "Sign in to continue");
  return user;
}

export function requireAdmin(req: Request): User {
  const user = requireUser(req);
  if (!user.isAdmin) throw new HttpError(403, "Admins only");
  return user;
}
