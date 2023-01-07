import { prisma } from "~/lib/db";
import type { PrismaClient, Room } from "@prisma/client";

class RoomRepository {
  constructor(private readonly db: PrismaClient) {}

  find(id: number): Promise<Room> {
    return this.db.room.findUniqueOrThrow({ where: { id } });
  }
}

export const roomRepository = new RoomRepository(prisma);
export const getRoomRepositoryForTest = (mockDB: PrismaClient) => new RoomRepository(mockDB);
