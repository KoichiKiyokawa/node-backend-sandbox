import "reflect-metadata";
import { ApolloDriver, type ApolloDriverConfig } from "@nestjs/apollo";
import { Injectable, Logger, Module, type OnApplicationShutdown } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { Args, Field, GraphQLModule, ID, ObjectType, Query, Resolver } from "@nestjs/graphql";
import { NodeAdapter } from "@nestjs/platform-node";
import { eq } from "drizzle-orm";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { pgTable, text } from "drizzle-orm/pg-core";
import { Pool } from "pg";

const usersTable = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
});

@ObjectType()
class User {
  @Field(() => ID)
  readonly id!: string;

  @Field(() => String)
  readonly name!: string;
}

@Injectable()
class UserRepository implements OnApplicationShutdown {
  private readonly pool: Pool;
  private readonly db: NodePgDatabase;

  constructor() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error("DATABASE_URL is required");

    const logger = new Logger(UserRepository.name);
    this.pool = new Pool({ connectionString });
    this.pool.on("error", (error) => logger.error(error));
    this.db = drizzle({ client: this.pool });
  }

  async findAll(): Promise<User[]> {
    return this.db.select().from(usersTable).orderBy(usersTable.id);
  }

  async findById(id: string): Promise<User | null> {
    const [user] = await this.db.select().from(usersTable).where(eq(usersTable.id, id)).limit(1);
    return user ?? null;
  }

  onApplicationShutdown(): Promise<void> {
    return this.pool.end();
  }
}

@Resolver(() => User)
class UserResolver {
  constructor(private readonly repository: UserRepository) {}

  @Query(() => [User])
  users(): Promise<User[]> {
    return this.repository.findAll();
  }

  @Query(() => User, { nullable: true })
  user(@Args("id", { type: () => ID }) id: string): Promise<User | null> {
    return this.repository.findById(id);
  }
}

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({ driver: ApolloDriver, autoSchemaFile: true }),
  ],
  providers: [UserRepository, UserResolver],
})
class AppModule {}

const app = await NestFactory.create(AppModule, new NodeAdapter(), { logger: ["error"] });
app.enableShutdownHooks();
await app.listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
console.log(`GraphQL ready at ${await app.getUrl()}/graphql`);
