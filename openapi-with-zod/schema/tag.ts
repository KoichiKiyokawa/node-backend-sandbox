import { TagObject } from "openapi3-ts/oas31";
import { OpenApiBuilder } from "openapi3-ts/oas31";

export const Tags = [{ name: "Users" }, { name: "Posts" }] as const;

export const tags = (...args: (typeof Tags)[number]["name"][]) => args;

const b = new OpenApiBuilder();
b.addPath("/users", {
  get: {
    responses: {
      200: {
        content: { "application/json": { schema: null } },
      },
    },
  },
});
