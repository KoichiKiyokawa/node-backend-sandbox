import { registry, z } from "../builder";
import { commonErrorResponse } from "../error";
import { tags } from "../tag";

const postSchema = z
  .object({
    id: z.string({ description: "Post ID" }).openapi({ example: "123" }),
    title: z
      .string({ description: "Post title" })
      .openapi({ example: "Title 1" }),
    content: z
      .string({ description: "Post content" })
      .openapi({ example: "lorem ipsum" }),
  })
  .openapi("Post");

registry.register("Post", postSchema);

registry.registerPath({
  method: "get",
  path: "/posts",
  description: "List all posts",
  tags: tags("Posts"),
  responses: {
    200: {
      description: "List of posts",
      content: { "application/json": { schema: z.array(postSchema) } },
    },
    ...commonErrorResponse,
  },
});

registry.registerPath({
  method: "get",
  path: "/posts/:id",
  description: "Get a post by ID",
  request: {
    params: z.object({ id: z.string() }),
  },
  tags: tags("Posts"),
  responses: {
    200: {
      description: "List of users",
      content: { "application/json": { schema: postSchema } },
    },
    ...commonErrorResponse,
  },
});

registry.registerPath({
  method: "post",
  path: "/posts",
  description: "Create a new post",
  tags: tags("Posts"),
  responses: {
    200: {
      description: "Created post",
      content: { "application/json": { schema: postSchema } },
    },
    ...commonErrorResponse,
  },
});
