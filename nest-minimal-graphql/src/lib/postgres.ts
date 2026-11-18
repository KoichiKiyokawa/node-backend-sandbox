import { Injectable, Logger, type OnApplicationShutdown } from "@nestjs/common";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

@Injectable()
export class Postgres implements OnApplicationShutdown {
  private readonly pool: Pool;
  readonly db: NodePgDatabase;

  constructor() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error("DATABASE_URL is required");

    const logger = new Logger(Postgres.name);
    this.pool = new Pool({ connectionString });
    this.pool.on("error", (error) => logger.error(error));
    this.db = drizzle({ client: this.pool });
  }

  onApplicationShutdown(): Promise<void> {
    return this.pool.end();
  }
}
