import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";
import { Postgres } from "../../lib/postgres.js";
import { Account } from "./account.js";

const accountsTable = pgTable("accounts", {
  id: text("id").primaryKey(),
  displayName: text("display_name").notNull(),
});

@Injectable()
export class AccountRepository {
  constructor(private readonly postgres: Postgres) {}

  async findAll(): Promise<Account[]> {
    const rows = await this.postgres.db.select().from(accountsTable).orderBy(accountsTable.id);
    return rows.map(({ id, displayName }) => new Account(id, displayName));
  }

  async findById(id: string): Promise<Account | null> {
    const [row] = await this.postgres.db
      .select()
      .from(accountsTable)
      .where(eq(accountsTable.id, id))
      .limit(1);
    return row ? new Account(row.id, row.displayName) : null;
  }

  async saveDisplayName(account: Account): Promise<Account | null> {
    const [row] = await this.postgres.db
      .update(accountsTable)
      .set({ displayName: account.displayName })
      .where(eq(accountsTable.id, account.id))
      .returning();
    return row ? new Account(row.id, row.displayName) : null;
  }
}
