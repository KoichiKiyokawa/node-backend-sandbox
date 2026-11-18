import type { ApolloDriver } from "@nestjs/apollo";
import type { INestApplication } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { afterAll, beforeAll, expect, test, vi } from "vite-plus/test";
import { startLocalPostgres } from "../../../db/local.js";
import { createApp } from "../../main.js";

let postgres: Awaited<ReturnType<typeof startLocalPostgres>>;
let app: INestApplication;
let apollo: ApolloDriver["instance"];

beforeAll(async () => {
  postgres = await startLocalPostgres();
  vi.stubEnv("DATABASE_URL", postgres.connectionString);
  vi.stubEnv("AUTH_URL", undefined);
  vi.stubEnv("AUTH_SECRET", undefined);
  try {
    app = await createApp();
  } finally {
    vi.unstubAllEnvs();
  }
  await app.init();
  apollo = app.get<GraphQLModule<ApolloDriver>>(GraphQLModule).graphQlAdapter.instance;
}, 15_000);

afterAll(async () => {
  try {
    await app?.close();
  } finally {
    await postgres?.close();
  }
});

const changeDisplayName = `
  mutation ChangeDisplayName($id: ID!, $displayName: String!) {
    changeAccountDisplayName(id: $id, displayName: $displayName) { id displayName }
  }
`;

test("exposes stored accounts through the GraphQL schema", async () => {
  await postgres.db.query("INSERT INTO accounts (id, display_name) VALUES ($1, $2)", [
    "3",
    "  Katherine  ",
  ]);

  expect(
    await execute(
      `query Accounts($id: ID!) {
        accounts { id displayName }
        account(id: $id) { id displayName }
        unknown: account(id: "missing") { id }
      }`,
      { id: "3" },
    ),
  ).toMatchObject({
    data: {
      accounts: expect.arrayContaining([{ id: "3", displayName: "Katherine" }]),
      account: { id: "3", displayName: "Katherine" },
      unknown: null,
    },
  });
});

test("applies the display name rule and stores the result for the selected account", async () => {
  expect(await execute(changeDisplayName, { id: "1", displayName: "  Ada Lovelace  " })).toEqual({
    data: { changeAccountDisplayName: { id: "1", displayName: "Ada Lovelace" } },
  });
  const result = await postgres.db.query(
    "SELECT id, display_name FROM accounts WHERE id IN ($1, $2) ORDER BY id",
    ["1", "2"],
  );
  expect(result.rows).toEqual([
    { id: "1", display_name: "Ada Lovelace" },
    { id: "2", display_name: "Grace" },
  ]);
});

test("reports a rejected display name as a GraphQL input error and preserves the row", async () => {
  expect(await execute(changeDisplayName, { id: "2", displayName: "   " })).toMatchObject({
    data: { changeAccountDisplayName: null },
    errors: [{ path: ["changeAccountDisplayName"], extensions: { code: "BAD_REQUEST" } }],
  });
  const result = await postgres.db.query("SELECT display_name FROM accounts WHERE id = $1", ["2"]);
  expect(result.rows).toEqual([{ display_name: "Grace" }]);
});

test("returns null for an unknown account without inserting a row", async () => {
  expect(await execute(changeDisplayName, { id: "missing", displayName: "Ada" })).toEqual({
    data: { changeAccountDisplayName: null },
  });
  const result = await postgres.db.query("SELECT id FROM accounts WHERE id = $1", ["missing"]);
  expect(result.rows).toEqual([]);
});

async function execute(query: string, variables: Record<string, string>) {
  const { body } = await apollo.executeOperation({ query, variables });
  if (body.kind !== "single") throw new Error("Expected a single GraphQL response");
  return body.singleResult;
}
