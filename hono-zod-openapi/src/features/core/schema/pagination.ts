import { z } from "@hono/zod-openapi";

export const PaginationSchema = z.object({
  per: z
    .string()
    .min(0)
    .openapi({
      description: "Number of items per page",
    })
    .transform(Number),
  page: z
    .string()
    .min(0)
    .openapi({ description: "Page number" })
    .transform(Number),
});
