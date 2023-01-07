import { usePrismaTest } from "test/use-prisma-test";
import { getRoomRepositoryForTest } from "./room.repository";

describe("RoomRepository", () => {
  it("find", () =>
    usePrismaTest(async (mockDB) => {
      await mockDB.room.create({
        data: {
          id: 1,
          name: "room1",
          createdAt: new Date(2020, 1, 1),
          updatedAt: new Date(2020, 1, 1),
        },
      });
      const roomRepo = getRoomRepositoryForTest(mockDB);
      expect(await roomRepo.find(1)).toStrictEqual({
        id: 1,
        name: "room1",
        createdAt: new Date(2020, 1, 1),
        updatedAt: new Date(2020, 1, 1),
      });

      await expect(() => roomRepo.find(2)).rejects.toThrowErrorMatchingInlineSnapshot(
        '"No Room found"'
      );
    }));
});
