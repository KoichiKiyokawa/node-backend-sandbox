import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import.meta.glob("./features/**/*.ts", { eager: true });
import { registry } from "./builder";
import { Tags } from "./tag";
import fs from "fs";

fs.writeFileSync(
  "openapi.json",
  JSON.stringify(
    new OpenApiGeneratorV3(registry.definitions).generateDocument({
      info: {
        title: "My API",
        version: "1.0.0",
      },
      tags: Object.values(Tags),
      openapi: "3.1.0",
    }),
    null,
    2
  )
);
