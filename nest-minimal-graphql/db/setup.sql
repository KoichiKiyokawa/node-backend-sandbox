BEGIN;

CREATE TABLE IF NOT EXISTS accounts (
  id text PRIMARY KEY,
  display_name text NOT NULL
);

INSERT INTO accounts (id, display_name)
VALUES ('1', 'Ada'), ('2', 'Grace')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS "user" (
  id text PRIMARY KEY,
  name text,
  email text UNIQUE,
  "emailVerified" timestamp,
  image text
);

CREATE TABLE IF NOT EXISTS account (
  "userId" text NOT NULL REFERENCES "user" (id) ON DELETE CASCADE,
  type text NOT NULL,
  provider text NOT NULL,
  "providerAccountId" text NOT NULL,
  refresh_token text,
  access_token text,
  expires_at integer,
  token_type text,
  scope text,
  id_token text,
  session_state text,
  PRIMARY KEY (provider, "providerAccountId")
);

CREATE TABLE IF NOT EXISTS session (
  "sessionToken" text PRIMARY KEY,
  "userId" text NOT NULL REFERENCES "user" (id) ON DELETE CASCADE,
  expires timestamp NOT NULL
);

CREATE TABLE IF NOT EXISTS authenticator (
  "credentialID" text NOT NULL UNIQUE,
  "userId" text NOT NULL REFERENCES "user" (id) ON DELETE CASCADE,
  "providerAccountId" text NOT NULL,
  "credentialPublicKey" text NOT NULL,
  counter integer NOT NULL,
  "credentialDeviceType" text NOT NULL,
  "credentialBackedUp" boolean NOT NULL,
  transports text,
  PRIMARY KEY ("userId", "credentialID")
);

COMMIT;
