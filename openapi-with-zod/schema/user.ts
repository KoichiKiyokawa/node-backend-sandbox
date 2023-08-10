import { registry, z } from "./builder";
import { commonErrorResponse } from "./error";

const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  birthday: z.date(),
});

registry.registerPath({
  path: "/users",
  method: "get",
  responses: {
    200: {
      description: "List of users",
      content: { "application/json": { schema: z.array(userSchema) } },
    },
    ...commonErrorResponse,
  },
});
