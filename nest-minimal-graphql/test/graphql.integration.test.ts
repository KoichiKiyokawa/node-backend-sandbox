import { spawn, type ChildProcessByStdio } from "node:child_process";
import { once } from "node:events";
import type { Readable } from "node:stream";
import { afterAll, beforeAll, expect, test } from "vite-plus/test";
import { startLocalPostgres } from "../db/local.js";

let postgres: Awaited<ReturnType<typeof startLocalPostgres>>;
let app: ChildProcessByStdio<null, Readable, Readable> | undefined;
let graphqlUrl: string;

beforeAll(async () => {
  postgres = await startLocalPostgres();
  app = spawn(process.execPath, ["dist/main.mjs"], {
    env: {
      ...process.env,
      DATABASE_URL: postgres.connectionString,
      NODE_ENV: "production",
      PORT: "0",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  graphqlUrl = await waitForGraphQL(app);
}, 15_000);

afterAll(async () => {
  try {
    if (app?.kill()) await once(app, "exit");
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

function waitForGraphQL(process: ChildProcessByStdio<null, Readable, Readable>): Promise<string> {
  return new Promise((resolve, reject) => {
    let output = "";
    const timeout = setTimeout(
      () => reject(new Error(`GraphQL did not start:\n${output}`)),
      10_000,
    );
    const recordOutput = (chunk: Buffer) => {
      output += chunk.toString();
      const url = output.match(/GraphQL ready at (http:\/\/\S+\/graphql)/)?.[1];
      if (url) {
        clearTimeout(timeout);
        resolve(url);
      }
    };
    process.stdout.on("data", recordOutput);
    process.stderr.on("data", recordOutput);
    process.once("error", (error) => {
      clearTimeout(timeout);
      reject(error);
    });
    process.once("exit", (code) => {
      clearTimeout(timeout);
      reject(new Error(`GraphQL exited (${code}):\n${output}`));
    });
  });
}
