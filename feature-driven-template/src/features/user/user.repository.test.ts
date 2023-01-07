import { usePrismaTest } from "test/use-prisma-test";
import { getUserRepositoryForTest } from "./user.repository";

describe("UserRepository", () => {
  it("findAll", () =>
    usePrismaTest(async (mockDB) => {
      await mockDB.user.create({
        data: {
          id: 1,
          email: "hoge@example.com",
          name: "foo",
          createdAt: new Date(2000, 1, 1),
          updatedAt: new Date(2000, 1, 1),
        },
      });
      expect(await getUserRepositoryForTest(mockDB).findAll()).toStrictEqual([
        {
          id: 1,
          email: "hoge@example.com",
          name: "foo",
          createdAt: new Date(2000, 1, 1),
          updatedAt: new Date(2000, 1, 1),
        },
      ]);
    }));

  it("find", () =>
    usePrismaTest(async (mockDB) => {
      await mockDB.user.create({
        data: {
          id: 1,
          email: "hoge@example.com",
          name: "foo",
          createdAt: new Date(2000, 1, 1),
          updatedAt: new Date(2000, 1, 1),
        },
      });

      const userRepo = getUserRepositoryForTest(mockDB);
      expect(await userRepo.find(1)).toStrictEqual({
        id: 1,
        email: "hoge@example.com",
        name: "foo",
        createdAt: new Date(2000, 1, 1),
        updatedAt: new Date(2000, 1, 1),
      });

      await expect(userRepo.find(2)).rejects.toThrowErrorMatchingInlineSnapshot('"No User found"');
    }));

  it("findJoinedRooms", () =>
    usePrismaTest(async (mockDB) => {
      const user1 = await mockDB.user.create({
        data: { id: 1, name: "user1", email: "user1@example.com" },
      });
      const user2 = await mockDB.user.create({
        data: { id: 2, name: "user2", email: "user2@example.com" },
      });
      await mockDB.room.create({
        data: {
          id: 1,
          name: "room1",
          createdAt: new Date(2000, 1, 1),
          updatedAt: new Date(2000, 1, 1),
          users: {
            connect: [{ id: user1.id }],
          },
        },
      });
      await mockDB.room.create({
        data: {
          id: 2,
          name: "room2",
          createdAt: new Date(2000, 1, 1),
          updatedAt: new Date(2000, 1, 1),
          users: {
            connect: [{ id: user2.id }],
          },
        },
      });

      const userRepo = getUserRepositoryForTest(mockDB);
      expect(await userRepo.findJoinedRooms(1)).toStrictEqual([
        { id: 1, name: "room1", createdAt: new Date(2000, 1, 1), updatedAt: new Date(2000, 1, 1) },
      ]);

      await mockDB.user.create({ data: { id: 3, name: "user3", email: "user3@example.com" } });
      expect(await userRepo.findJoinedRooms(3)).toStrictEqual([]);
    }));
});
