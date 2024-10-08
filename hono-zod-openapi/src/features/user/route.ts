import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";

import { PaginationSchema } from "../core/schema/pagination";
import { UserCreateSchema, UserSchema } from "./schema";
import { getErrorResponses } from "../core/schema/error";
import { db } from "../../lib/db";
import { setCacheControl } from "../core/header";

const route = new OpenAPIHono()
  .openapi(
    createRoute({
      summary: "List of users",
      method: "get",
      path: "/users",
      tags: ["User"],
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
    }),
    async (c) => {
      setCacheControl(c, { private: true, maxAge: 80 });
      const { per, page } = c.req.valid("query");
      const users = await db.user.findMany({
        skip: per * page,
        take: per,
        orderBy: { id: "asc" },
      });
      return c.json({ users }, 200);
    }
  )
  .openapi(
    createRoute({
      summary: "Get a user by ID",
      method: "get",
      path: "/users/{id}",
      tags: ["User"],
      request: { params: z.object({ id: UserSchema.shape.id }) },
      responses: {
        200: {
          description: "Get a user by ID",
          content: {
            "application/json": {
              schema: z.object({ user: UserSchema }),
            },
          },
        },
        ...getErrorResponses(404, 500),
      },
    }),
    async (c) => {
      const user = await db.user.findUnique({
        where: { id: c.req.param("id") },
      });
      if (user === null) throw new HTTPException(404);

      return c.json({ user }, 200);
    }
  )
  .openapi(
    createRoute({
      summary: "Create a user",
      method: "post",
      path: "/users",
      tags: ["User"],
      request: {
        body: { content: { "application/json": { schema: UserCreateSchema } } },
      },
      responses: {
        201: {
          description: "Create a user",
          content: {
            "application/json": {
              schema: z.object({ user: UserSchema }),
            },
          },
        },
        ...getErrorResponses(500),
      },
    }),
    async (c) => {
      const user = await c.var.db.user.create({ data: c.req.valid("json") });
      return c.json({ user }, 201);
    }
  );

export default route;
