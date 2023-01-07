import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "develop" ? ["query", "error", "info", "warn"] : [],
});
