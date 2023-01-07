import { prisma } from "~/lib/db";
import type { PrismaClient, User } from "@prisma/client";

class UserRepository {
  constructor(private readonly db: PrismaClient) {}

  findAll(): Promise<User[]> {
    return this.db.user.findMany();
  }
}

export const userRepository = new UserRepository(prisma);
export const getUserRepositoryForTest = (mockDB: PrismaClient) => new UserRepository(mockDB);
