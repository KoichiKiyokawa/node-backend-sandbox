import { z } from "@hono/zod-openapi";

export const PaginationSchema = z
  .object({
    per: z.coerce.number().default(50).openapi({
      description: "Number of items per page",
    }),
    page: z.coerce
      .number()
      .min(0)
      .default(0)
      .openapi({ description: "Page number" }),
  })
  .openapi("Pagination");
