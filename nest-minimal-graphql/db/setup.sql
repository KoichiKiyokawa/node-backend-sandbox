BEGIN;

CREATE TABLE IF NOT EXISTS accounts (
  id text PRIMARY KEY,
  display_name text NOT NULL
);

INSERT INTO accounts (id, display_name)
VALUES ('1', 'Ada'), ('2', 'Grace')
ON CONFLICT (id) DO NOTHING;

COMMIT;
