import { z } from "@hono/zod-openapi";

export const UserSchema = z
  .object({
    id: z.string().uuid().openapi({ description: "ユーザーID" }),
    name: z.string().min(3).max(32).openapi({ description: "ユーザー名" }),
    email: z.string().email().openapi({ description: "メールアドレス" }),
  })
  .openapi("User");

export const UserCreateSchema = UserSchema.omit({ id: true });

export const UserUpdateSchema = UserCreateSchema.partial();
