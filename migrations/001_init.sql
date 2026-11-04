CREATE TABLE users (
  id          TEXT PRIMARY KEY,
  email       TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  is_admin    INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL
);

CREATE TABLE books (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES users(id),
  title       TEXT NOT NULL,
  author      TEXT NOT NULL,
  slug        TEXT NOT NULL,
  pages       INTEGER,
  finished_at TEXT,
  created_at  TEXT NOT NULL
);

CREATE INDEX books_user ON books(user_id);

CREATE TABLE sessions (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES users(id),
  expires_at  TEXT NOT NULL
);
