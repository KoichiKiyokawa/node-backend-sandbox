import "reflect-metadata";
import { ApolloDriver, type ApolloDriverConfig } from "@nestjs/apollo";
import { Injectable, Module } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { Args, Field, GraphQLModule, ID, ObjectType, Query, Resolver } from "@nestjs/graphql";
import { NodeAdapter } from "@nestjs/platform-node";

@ObjectType()
class User {
  @Field(() => ID)
  readonly id: string;

  @Field(() => String)
  readonly name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}

@Injectable()
class UserRepository {
  private readonly users = [new User("1", "Ada"), new User("2", "Grace")];

  findAll(): readonly User[] {
    return this.users;
  }

  findById(id: string): User | null {
    return this.users.find((user) => user.id === id) ?? null;
  }
}

@Resolver(() => User)
class UserResolver {
  constructor(private readonly repository: UserRepository) {}

  @Query(() => [User])
  users(): readonly User[] {
    return this.repository.findAll();
  }

  @Query(() => User, { nullable: true })
  user(@Args("id", { type: () => ID }) id: string): User | null {
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
