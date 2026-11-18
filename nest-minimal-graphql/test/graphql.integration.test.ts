import { afterAll, beforeAll, expect, test } from "vite-plus/test";
import { startLocalPostgres } from "../db/local.js";
import { startBuiltApp } from "./start-built-app.js";

let postgres: Awaited<ReturnType<typeof startLocalPostgres>>;
let app: Awaited<ReturnType<typeof startBuiltApp>>;
let graphqlUrl: string;

beforeAll(async () => {
  postgres = await startLocalPostgres();
  app = await startBuiltApp(postgres.connectionString);
  graphqlUrl = new URL("/graphql", app.url).href;
}, 15_000);

afterAll(async () => {
  try {
    await app?.close();
  } finally {
    await postgres?.close();
  }
});

test("reads the seeded accounts and returns null for an unknown ID", async () => {
  expect(
    await query('{ accounts { __typename id displayName } account(id: "missing") { id } }'),
  ).toEqual({
    data: {
      accounts: [
        { __typename: "Account", id: "1", displayName: "Ada" },
        { __typename: "Account", id: "2", displayName: "Grace" },
      ],
      account: null,
    },
  });
});

test("reads an account added directly to PostgreSQL", async () => {
  await postgres.db.query("INSERT INTO accounts (id, display_name) VALUES ($1, $2)", [
    "3",
    "  Katherine  ",
  ]);
  expect(await query('{ account(id: "3") { id displayName } }')).toEqual({
    data: { account: { id: "3", displayName: "Katherine" } },
  });
});

test("changes the display name and persists the normalized value", async () => {
  expect(
    await query(
      'mutation { changeAccountDisplayName(id: "1", displayName: "  Ada Lovelace  ") { id displayName } }',
    ),
  ).toEqual({
    data: { changeAccountDisplayName: { id: "1", displayName: "Ada Lovelace" } },
  });
  const result = await postgres.db.query("SELECT display_name FROM accounts WHERE id = $1", ["1"]);
  expect(result.rows).toEqual([{ display_name: "Ada Lovelace" }]);
});

test("rejects a blank display name and preserves the stored value", async () => {
  expect(
    await query('mutation { changeAccountDisplayName(id: "2", displayName: "   ") { id } }'),
  ).toMatchObject({
    data: { changeAccountDisplayName: null },
    errors: [
      { message: "Account display name must not be blank", extensions: { code: "BAD_REQUEST" } },
    ],
  });
  const result = await postgres.db.query("SELECT display_name FROM accounts WHERE id = $1", ["2"]);
  expect(result.rows).toEqual([{ display_name: "Grace" }]);
});

async function query(document: string): Promise<unknown> {
  const response = await fetch(graphqlUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ query: document }),
    signal: AbortSignal.timeout(5_000),
  });
  expect(response.status).toBe(200);
  return response.json();
}
