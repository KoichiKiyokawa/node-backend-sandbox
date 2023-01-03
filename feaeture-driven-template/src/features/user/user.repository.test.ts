import { usePrismaTest } from "~/../test/use-prisma-test";
import { getUserRepositoryForTest } from "./user.repository";

describe("userRepository", () => {
  usePrismaTest();

  it("findAll", async () => {
    await mockDB.user.create({
      data: {
        email: "hoge@example.com",
        name: "foo",
        createdAt: new Date(2000, 1, 1),
        updatedAt: new Date(2000, 1, 1),
      },
    });
    const userRepository = getUserRepositoryForTest(mockDB);
    expect(await userRepository.findAll()).toStrictEqual([
      {
        id: 1,
        email: "hoge@example.com",
        name: "foo",
        createdAt: new Date(2000, 1, 1),
        updatedAt: new Date(2000, 1, 1),
      },
    ]);
  });
});
