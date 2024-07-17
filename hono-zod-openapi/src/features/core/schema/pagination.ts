import { z } from "@hono/zod-openapi";

export const PaginationSchema = z.object({
  per: z.string().pipe(z.coerce.number()).openapi({
    description: "Number of items per page",
    default: "50",
  }),
  page: z
    .string()
    .min(0)
    .default("0")
    .pipe(z.coerce.number())
    .openapi({ description: "Page number" }),
});
