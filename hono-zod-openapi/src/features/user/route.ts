import { createRoute, z } from "@hono/zod-openapi";
import { app } from "../../builder";
import { getErrorResponses } from "../core/schema/error";
import { UserSchema } from "./schema";
import { PaginationSchema } from "../core/schema/pagination";

app.openapi(
  createRoute({
    method: "get",
    path: "/users",
    request: { query: PaginationSchema },
    responses: {
      200: {
        description: "List of users",
        content: {
          "application/json": {
            schema: z.object({ users: z.array(UserSchema) }),
          },
        },
      },
      ...getErrorResponses(500),
    },
  } as const),
  async (c) => {
    const { per, page } = c.req.valid("query");
    const users = await c.var.db.user.findMany({
      skip: per * page,
      take: per,
    });
    return c.json({ users });
  }
);
