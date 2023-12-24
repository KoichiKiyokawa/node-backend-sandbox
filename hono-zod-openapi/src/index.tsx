import { serve } from "@hono/node-server";
import { PrismaClient } from "@prisma/client";
import { MiddlewareHandler } from "hono";
import { swaggerUI } from "@hono/swagger-ui";

import "./features/user/route";
import "./env";

import { app } from "./builder";

if (process.env.NODE_ENV === "development") {
  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "My API",
    },
  });
  app.get("/swagger", swaggerUI({ url: "/doc" }));
  app.get("/redoc", (c) => {
    return c.render(
      <html>
        <head>
          <title>Redoc</title>
          <body>
            <redoc spec-url="/doc"></redoc>
            <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"></script>
          </body>
        </head>
      </html>
    );
  });
}

declare module "hono" {
  interface ContextVariableMap {
    db: PrismaClient;
  }
}

const dbMiddleware: MiddlewareHandler = async (c, next) => {
  c.set("db", new PrismaClient());
  await next();
};
app.use(dbMiddleware);

serve(app);
