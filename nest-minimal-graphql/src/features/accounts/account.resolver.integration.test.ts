import "reflect-metadata";
import { BadRequestException, type INestApplicationContext } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { afterAll, beforeAll, expect, test } from "vite-plus/test";
import { startLocalPostgres } from "../../../db/local.js";
import { Postgres } from "../../lib/postgres.js";
import { AccountRepository } from "./account.repository.js";
import { AccountResolver } from "./account.resolver.js";
import { Account } from "./account.js";

let postgres: Awaited<ReturnType<typeof startLocalPostgres>>;
let app: INestApplicationContext;
let handler: AccountResolver;

beforeAll(async () => {
  postgres = await startLocalPostgres();

  const previousDatabaseUrl = process.env.DATABASE_URL;
  process.env.DATABASE_URL = postgres.connectionString;
  try {
    // Nest resolves the real dependencies, but no HTTP server or GraphQL executor starts.
    app = await NestFactory.createApplicationContext(
      { providers: [Postgres, AccountRepository, AccountResolver] },
      { logger: false },
    );
  } finally {
    if (previousDatabaseUrl === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = previousDatabaseUrl;
  }
  handler = app.get(AccountResolver);
}, 15_000);

afterAll(async () => {
  try {
    await app?.close();
  } finally {
    await postgres?.close();
  }
});

test("reads stored accounts through the handler and repository", async () => {
  await postgres.db.query("INSERT INTO accounts (id, display_name) VALUES ($1, $2)", [
    "3",
    "  Katherine  ",
  ]);

  expect(await handler.account("3")).toStrictEqual(new Account("3", "Katherine"));
  expect(await handler.accounts()).toContainEqual(new Account("3", "Katherine"));
  expect(await handler.account("missing")).toBeNull();
});

test("applies the domain rule and persists the result through the handler", async () => {
  expect(await handler.changeAccountDisplayName("1", "  Ada Lovelace  ")).toStrictEqual(
    new Account("1", "Ada Lovelace"),
  );

  const result = await postgres.db.query(
    "SELECT id, display_name FROM accounts WHERE id IN ($1, $2) ORDER BY id",
    ["1", "2"],
  );
  expect(result.rows).toEqual([
    { id: "1", display_name: "Ada Lovelace" },
    { id: "2", display_name: "Grace" },
  ]);
});

test("converts an invalid domain change to a handler error without persisting it", async () => {
  await expect(handler.changeAccountDisplayName("2", "   ")).rejects.toThrow(
    BadRequestException,
  );
  const result = await postgres.db.query("SELECT display_name FROM accounts WHERE id = $1", ["2"]);
  expect(result.rows).toEqual([{ display_name: "Grace" }]);
});

test("returns null for an unknown account without writing a row", async () => {
  expect(await handler.changeAccountDisplayName("missing", "Ada")).toBeNull();
  const result = await postgres.db.query("SELECT id FROM accounts WHERE id = $1", ["missing"]);
  expect(result.rows).toEqual([]);
});
