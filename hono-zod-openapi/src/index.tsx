import { serve } from "@hono/node-server";
import { swaggerUI } from "@hono/swagger-ui";
import { PrismaClient } from "@prisma/client";

import { OpenAPIHono } from "@hono/zod-openapi";
import "./env";
import userRoute from "./features/user/route";

const app = new OpenAPIHono();

declare module "hono" {
  interface ContextVariableMap {
    db: PrismaClient;
  }
}

app.use(async (c, next) => {
  c.set("db", new PrismaClient());
  await next();
});

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

const routes = app.route("/", userRoute);

export type AppType = typeof routes;

serve(app);
