CREATE TABLE reading_goals (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES users(id),
  year        INTEGER NOT NULL,
  target      INTEGER NOT NULL CHECK (target > 0),
  created_at  TEXT NOT NULL,
  UNIQUE (user_id, year)
);

-- Streaks are computed from finished_at; index it for the per-user scans.
CREATE INDEX books_finished ON books(user_id, finished_at);
