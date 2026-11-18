import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import { PGLiteSocketServer } from "@electric-sql/pglite-socket";

export async function startLocalPostgres(port = 0) {
  const db = await PGlite.create();
  const server = new PGLiteSocketServer({ db, port, host: "127.0.0.1", maxConnections: 10 });
  try {
    await db.exec(await readFile(new URL("./setup.sql", import.meta.url), "utf8"));
    await server.start();
  } catch (error) {
    await db.close();
    throw error;
  }

  return {
    db,
    connectionString: `postgresql://postgres@${server.getServerConn()}/postgres?sslmode=disable`,
    async close() {
      try {
        await server.stop();
      } finally {
        await db.close();
      }
    },
  };
}

if (import.meta.main) {
  const postgres = await startLocalPostgres(55432);
  console.log(`DATABASE_URL=${postgres.connectionString}`);
  process.once("SIGINT", () => void postgres.close());
  process.once("SIGTERM", () => void postgres.close());
}
