import { usePrismaTest } from "../../test/use-prisma-test"
import { UserRepository } from "./user"

usePrismaTest()

describe("UserRepository", () => {
  it("findAll", async () => {
    await mockPrisma.user.create({
      data: {
        id: 1,
        email: "user1@example.com",
      },
    })

    const userRepo = new UserRepository(mockPrisma)
    expect(await userRepo.findAll()).toStrictEqual([
      {
        id: 1,
        email: "user1@example.com",
        name: null,
      },
    ])
  })

  it("findAll 2", async () => {
    await mockPrisma.user.create({
      data: {
        id: 2,
        email: "user2@example.com",
      },
    })

    const userRepo = new UserRepository(mockPrisma)
    expect(await userRepo.findAll()).toStrictEqual([
      {
        id: 2,
        email: "user2@example.com",
        name: null,
      },
    ])
  })

  it.each([...Array(1000)].map((_, i) => i))("findAll each %i", async (i) => {
    await mockPrisma.user.create({
      data: {
        id: i,
        email: `user${i}@example.com`,
      },
    })

    const userRepo = new UserRepository(mockPrisma)
    expect(await userRepo.findAll()).toStrictEqual([
      {
        id: i,
        email: `user${i}@example.com`,
        name: null,
      },
    ])
  })
})
