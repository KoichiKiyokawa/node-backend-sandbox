import { usePrismaTest } from "test/use-prisma-test";
import { getUserRepositoryForTest } from "./user.repository";

describe("UserRepository", () => {
  it("findAll", () =>
    usePrismaTest(async (mockDB) => {
      await mockDB.user.create({
        data: {
          email: "hoge@example.com",
          name: "foo",
          createdAt: new Date(2000, 1, 1),
          updatedAt: new Date(2000, 1, 1),
        },
      });
      expect(await getUserRepositoryForTest(mockDB as any).findAll()).toStrictEqual([
        {
          id: 1,
          email: "hoge@example.com",
          name: "foo",
          createdAt: new Date(2000, 1, 1),
          updatedAt: new Date(2000, 1, 1),
        },
      ]);
    }));
});
