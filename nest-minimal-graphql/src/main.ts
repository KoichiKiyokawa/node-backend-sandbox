import "reflect-metadata";
import { ApolloDriver, type ApolloDriverConfig } from "@nestjs/apollo";
import {
  BadRequestException,
  Injectable,
  Logger,
  Module,
  type OnApplicationShutdown,
} from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import {
  Args,
  Field,
  GraphQLModule,
  ID,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "@nestjs/graphql";
import { NodeAdapter } from "@nestjs/platform-node";
import { eq } from "drizzle-orm";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { pgTable, text } from "drizzle-orm/pg-core";
import { Pool } from "pg";
import { Account, InvalidAccountDisplayNameError } from "./account.js";

const accountsTable = pgTable("accounts", {
  id: text("id").primaryKey(),
  displayName: text("display_name").notNull(),
});

@ObjectType("Account")
class AccountObject {
  @Field(() => ID)
  readonly id!: string;

  @Field(() => String)
  readonly displayName!: string;
}

@Injectable()
class AccountRepository implements OnApplicationShutdown {
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

@Resolver(() => AccountObject)
class AccountResolver {
  constructor(private readonly repository: AccountRepository) {}

  @Query(() => [AccountObject])
  accounts(): Promise<Account[]> {
    return this.repository.findAll();
  }

  @Query(() => AccountObject, { nullable: true })
  account(@Args("id", { type: () => ID }) id: string): Promise<Account | null> {
    return this.repository.findById(id);
  }

  @Mutation(() => AccountObject, { nullable: true })
  async changeAccountDisplayName(
    @Args("id", { type: () => ID }) id: string,
    @Args("displayName", { type: () => String }) displayName: string,
  ): Promise<Account | null> {
    const account = await this.repository.findById(id);
    if (!account) return null;

    try {
      return this.repository.saveDisplayName(account.changeDisplayName(displayName));
    } catch (error) {
      if (error instanceof InvalidAccountDisplayNameError) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }
}

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({ driver: ApolloDriver, autoSchemaFile: true }),
  ],
  providers: [AccountRepository, AccountResolver],
})
class AppModule {}

const app = await NestFactory.create(AppModule, new NodeAdapter(), { logger: ["error"] });
app.enableShutdownHooks();
await app.listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
console.log(`GraphQL ready at ${await app.getUrl()}/graphql`);
