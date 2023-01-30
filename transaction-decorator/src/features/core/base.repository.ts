import type { PrismaClient } from "@prisma/client"

export class BaseRepository {
  constructor(private readonly prisma: PrismaClient) {}

  protected get db() {
    return global.db || this.prisma
  }
}
