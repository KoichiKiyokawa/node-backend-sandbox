import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  /* c8 ignore next */
  log: process.env.NODE_ENV === "develop" ? ["query", "error", "info", "warn"] : [],
});
