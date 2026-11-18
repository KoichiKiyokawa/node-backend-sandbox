import "reflect-metadata";
import { ApolloDriver, type ApolloDriverConfig } from "@nestjs/apollo";
import { NestFactory } from "@nestjs/core";
import { GraphQLModule } from "@nestjs/graphql";
import { NodeAdapter } from "@nestjs/platform-node";
import { AccountRepository } from "./features/accounts/account.repository.js";
import { AccountResolver } from "./features/accounts/account.resolver.js";
import { PasskeyController } from "./features/auth/passkey.controller.js";
import { Postgres } from "./lib/postgres.js";

const app = await NestFactory.create(
  {
    imports: [
      GraphQLModule.forRoot<ApolloDriverConfig>({ driver: ApolloDriver, autoSchemaFile: true }),
    ],
    controllers: [PasskeyController],
    providers: [Postgres, AccountRepository, AccountResolver],
  },
  new NodeAdapter(),
  { logger: ["error"] },
);
app.enableShutdownHooks();
await app.listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
console.log(`GraphQL ready at ${await app.getUrl()}/graphql`);
