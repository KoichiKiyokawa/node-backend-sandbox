import { z } from "./builder";

const errSchema = z.object({
  code: z.number(),
  message: z.string(),
});

export const commonErrorResponse = {
  500: {
    description: "Internal Server Error",
    content: { "application/json": { schema: errSchema } },
  },
};
