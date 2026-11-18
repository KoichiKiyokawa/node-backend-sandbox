import { afterAll, beforeAll, expect, test } from "vite-plus/test";
import { startLocalPostgres } from "../../../db/local.js";
import { Postgres } from "../../lib/postgres.js";
import { AccountRepository } from "./account.repository.js";
import { Account } from "./account.js";

let postgres: Awaited<ReturnType<typeof startLocalPostgres>>;
let connection: Postgres;
let repository: AccountRepository;

beforeAll(async () => {
  postgres = await startLocalPostgres();
  const previousUrl = process.env.DATABASE_URL;
  process.env.DATABASE_URL = postgres.connectionString;
  try {
    connection = new Postgres();
  } finally {
    if (previousUrl === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = previousUrl;
  }
  repository = new AccountRepository(connection);
}, 15_000);

afterAll(async () => {
  try {
    await connection?.onApplicationShutdown();
  } finally {
    await postgres?.close();
  }
});

test("maps PostgreSQL rows to domain accounts", async () => {
  await postgres.db.query("INSERT INTO accounts (id, display_name) VALUES ($1, $2)", [
    "3",
    "  Katherine  ",
  ]);

  expect(await repository.findById("3")).toStrictEqual(new Account("3", "Katherine"));
  expect(await repository.findAll()).toContainEqual(new Account("3", "Katherine"));
  expect(await repository.findById("missing")).toBeNull();
});

test("writes the new display name to the matching row", async () => {
  const changed = new Account("1", "Ada").changeDisplayName("  Ada Lovelace  ");

  expect(await repository.saveDisplayName(changed)).toStrictEqual(changed);
  const result = await postgres.db.query(
    "SELECT id, display_name FROM accounts WHERE id IN ($1, $2) ORDER BY id",
    ["1", "2"],
  );
  expect(result.rows).toEqual([
    { id: "1", display_name: "Ada Lovelace" },
    { id: "2", display_name: "Grace" },
  ]);
});

test("returns null when there is no row to update", async () => {
  expect(await repository.saveDisplayName(new Account("missing", "Ada"))).toBeNull();
  expect(await repository.findById("missing")).toBeNull();
});
