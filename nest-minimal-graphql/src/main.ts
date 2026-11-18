import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { NodeAdapter } from "@nestjs/platform-node";
import { AppModule } from "./app.module.js";

const app = await NestFactory.create(AppModule, new NodeAdapter(), { logger: ["error"] });
app.enableShutdownHooks();
await app.listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
console.log(`GraphQL ready at ${await app.getUrl()}/graphql`);
