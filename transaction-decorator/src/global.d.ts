import type { PrismaClient, Prisma } from "@prisma/client"

declare global {
  var db: PrismaClient | Prisma.TransactionClient | null
}
