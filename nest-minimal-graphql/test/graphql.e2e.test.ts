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

test("reads the updated display name through the built HTTP endpoint", async () => {
  expect(
    await query(
      'mutation { changeAccountDisplayName(id: "1", displayName: "  Ada Lovelace  ") { id displayName } }',
    ),
  ).toEqual({
    data: { changeAccountDisplayName: { id: "1", displayName: "Ada Lovelace" } },
  });
  expect(await query('{ account(id: "1") { __typename id displayName } }')).toEqual({
    data: { account: { __typename: "Account", id: "1", displayName: "Ada Lovelace" } },
  });
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
