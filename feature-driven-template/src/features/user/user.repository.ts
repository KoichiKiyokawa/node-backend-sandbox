import { prisma } from "~/lib/db";
import type { PrismaClient, Room, User } from "@prisma/client";

class UserRepository {
  constructor(private readonly db: PrismaClient) {}

  findAll(): Promise<User[]> {
    return this.db.user.findMany();
  }

  find(id: number): Promise<User> {
    return this.db.user.findUniqueOrThrow({ where: { id } });
  }

  // find rooms that the user is joining
  findJoinedRooms(userId: number): Promise<Room[]> {
    return this.db.user.findUniqueOrThrow({ where: { id: userId } }).joiningRooms();
  }
}

export const userRepository = new UserRepository(prisma);
export const getUserRepositoryForTest = (mockDB: PrismaClient) => new UserRepository(mockDB);
