import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import fs from "fs";
import { registry } from "./builder";
import { TAGS } from "./tag";
import.meta.glob("./features/**/*.ts", { eager: true });

fs.writeFileSync(
  "openapi.json",
  JSON.stringify(
    new OpenApiGeneratorV3(registry.definitions).generateDocument({
      info: {
        title: "My API",
        version: "1.0.0",
      },
      tags: TAGS.map((tag) => ({ name: tag })),
      openapi: "3.1.0",
    }),
    null,
    2
  )
);
