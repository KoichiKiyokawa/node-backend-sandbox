import type { PrismaClient } from "@prisma/client"

export class UserRepository {
  constructor(private readonly db: PrismaClient) {}

  findAll() {
    return this.db.user.findMany()
  }
}
