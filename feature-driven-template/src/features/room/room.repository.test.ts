import {usePrismaTest} from '~/../test/use-prisma-test'
import { getRoomRepositoryForTest } from "./room.repository"

describe("RoomRepository", () => {
  it("findAll", () =>
    usePrismaTest(async (mockDB) => {
      await mockDB.room.create({
        data: {/* dummy data */}
      });
      const roomRepository = getRoomRepositoryForTest(mockDB)
      expect(await roomRepository.findAll()).toStrictEqual([
        {/* dummy data */}
      ]);
    }));
});

