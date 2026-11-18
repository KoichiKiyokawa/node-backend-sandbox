import { Injectable, Logger, type OnApplicationShutdown } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { pgTable, text } from "drizzle-orm/pg-core";
import { Pool } from "pg";
import { Account } from "./account.js";

const accountsTable = pgTable("accounts", {
  id: text("id").primaryKey(),
  displayName: text("display_name").notNull(),
});

@Injectable()
export class AccountRepository implements OnApplicationShutdown {
  private readonly pool: Pool;
  private readonly db: NodePgDatabase;

  constructor() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error("DATABASE_URL is required");

    const logger = new Logger(AccountRepository.name);
    this.pool = new Pool({ connectionString });
    this.pool.on("error", (error) => logger.error(error));
    this.db = drizzle({ client: this.pool });
  }

  async findAll(): Promise<Account[]> {
    const rows = await this.db.select().from(accountsTable).orderBy(accountsTable.id);
    return rows.map(({ id, displayName }) => new Account(id, displayName));
  }

  async findById(id: string): Promise<Account | null> {
    const [row] = await this.db
      .select()
      .from(accountsTable)
      .where(eq(accountsTable.id, id))
      .limit(1);
    return row ? new Account(row.id, row.displayName) : null;
  }

  async saveDisplayName(account: Account): Promise<Account | null> {
    const [row] = await this.db
      .update(accountsTable)
      .set({ displayName: account.displayName })
      .where(eq(accountsTable.id, account.id))
      .returning();
    return row ? new Account(row.id, row.displayName) : null;
  }

  onApplicationShutdown(): Promise<void> {
    return this.pool.end();
  }
}
