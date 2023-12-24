import { z } from "@hono/zod-openapi";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]),
});

EnvSchema.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof EnvSchema> {}
  }
}
