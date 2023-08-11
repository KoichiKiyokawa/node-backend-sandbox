import { z } from "./builder";

const errSchema = z.object({
  code: z.number(),
  message: z.string(),
});

export const commonErrorResponse = {
  400: {
    description: "Bad Request",
    content: {
      "application/json": {
        schema: errSchema.openapi({
          example: { code: 400, message: "Bad Request" },
        }),
      },
    },
  },
  404: {
    description: "Not Found",
    content: {
      "application/json": {
        schema: errSchema.openapi({
          example: { code: 404, message: "Not Found" },
        }),
      },
    },
  },
  500: {
    description: "Internal Server Error",
    content: {
      "application/json": {
        schema: errSchema.openapi({
          example: { code: 500, message: "Internal Server Error" },
        }),
      },
    },
  },
};
