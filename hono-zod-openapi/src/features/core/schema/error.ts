import { z } from "@hono/zod-openapi";

export const ErrorSchema = z.object({ code: z.number(), error: z.string() });

const errorResponses = {
  404: {
    description: "Not found",
    content: {
      "application/json": {
        schema: ErrorSchema,
      },
    },
  },
  500: {
    description: "Internal server error",
    content: {
      "application/json": {
        schema: ErrorSchema,
      },
    },
  },
};

export const getErrorResponses = (
  ...codes: (keyof typeof errorResponses)[]
) => {
  return codes.reduce((acc, code) => {
    return { ...acc, [code]: errorResponses[code] };
  }, {});
};
