import { prisma } from "~/lib/db";
import type { PrismaClient, User } from "@prisma/client";

class UserRepository {
  private readonly db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  findAll(): Promise<User[]> {
    return this.db.user.findMany();
  }
}

export const userRepository = new UserRepository(prisma);
export const getUserRepositoryForTest = (mockDB: PrismaClient) => new UserRepository(mockDB);
