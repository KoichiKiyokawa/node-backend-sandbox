BEGIN;

CREATE TABLE IF NOT EXISTS users (
  id text PRIMARY KEY,
  name text NOT NULL
);

INSERT INTO users (id, name)
VALUES ('1', 'Ada'), ('2', 'Grace')
ON CONFLICT (id) DO NOTHING;

COMMIT;
