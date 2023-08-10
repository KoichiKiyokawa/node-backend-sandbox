import { registry, z } from "../builder";
import { commonErrorResponse } from "../error";
import { tags } from "../tag";

const userSchema = z
  .object({
    id: z.string({ description: "User ID" }),
    name: z.string({ description: "User name" }),
    email: z.string({ description: "User email" }).email(),
    birthday: z.date({ description: "User birthday" }),
  })
  .openapi("User");

registry.register("User", userSchema);

registry.registerPath({
  method: "get",
  path: "/users",
  description: "List all users",
  tags: tags("Users"),
  responses: {
    200: {
      description: "List of users",
      content: { "application/json": { schema: z.array(userSchema) } },
    },
    ...commonErrorResponse,
  },
});

registry.registerPath({
  method: "get",
  path: "/users/:id",
  description: "Get a user by ID",
  request: {
    params: z.object({ id: z.string() }),
  },
  tags: tags("Users"),
  responses: {
    200: {
      description: "List of users",
      content: { "application/json": { schema: userSchema } },
    },
    ...commonErrorResponse,
  },
});

registry.registerPath({
  method: "post",
  path: "/users",
  description: "Create a new user",
  tags: tags("Users"),
  responses: {
    200: {
      description: "Created user",
      content: { "application/json": { schema: userSchema } },
    },
    ...commonErrorResponse,
  },
});
