import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import.meta.glob("./**/*.ts", { eager: true });
import { registry } from "./builder";

console.log(
  JSON.stringify(
    new OpenApiGeneratorV3(registry.definitions).generateDocument({
      info: {
        title: "My API",
        version: "1.0.0",
      },
      openapi: "3.1.0",
    }),
    null,
    2
  )
);
