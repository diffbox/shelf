import { db, newId, type Session } from "../db.js";
import { HttpError, type Request } from "../http.js";

/** How long a sign-in lasts. */
export const SESSION_DAYS = 30;

export function createSession(userId: string): Session {
  const session = {
    id: newId("ses"),
    userId,
    expiresAt: new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000),
  };
  db.sessions.set(session.id, session);
  return session;
}

export function sessionCookie(session: Session) {
  return [
    `shelf_session=${session.id}`,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    `Expires=${session.expiresAt.toUTCString()}`,
  ].join("; ");
}

/** The signed-in user's session, or null when there isn't a valid one. */
export function readSession(req: Request): Session | null {
  const cookie = req.headers.cookie ?? "";
  const id = /(?:^|;\s*)shelf_session=([^;]+)/.exec(cookie)?.[1];
  if (!id) return null;
  const session = db.sessions.get(id);
  if (!session || session.expiresAt.getTime() < Date.now()) return null;
  return session;
}

export function endSession(req: Request) {
  const session = readSession(req);
  if (!session) throw new HttpError(401, "Not signed in");
  db.sessions.delete(session.id);
}
