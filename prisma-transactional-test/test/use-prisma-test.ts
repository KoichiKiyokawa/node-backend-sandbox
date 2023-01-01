import type { PrismaClient } from "@prisma/client"
import { db } from "../src/lib/db"

declare global {
  var mockPrisma: PrismaClient
}

/**
 * Rollback the database after each test case.
 * cf) https://github.com/Quramy/jest-prisma/blob/a5ac388db625b9f237ff6143ee5c63860012ceb3/packages/jest-prisma-core/src/delegate.ts#L102
 */
export function usePrismaTest() {
  let onEnd: () => void

  beforeEach(async () => {
    await new Promise<void>((resolve) =>
      db
        .$transaction(async (tx) => {
          global.mockPrisma = tx as PrismaClient
          resolve()
          return new Promise((_, reject) => {
            onEnd = reject
          })
        })
        .catch(() => null)
    )
  })

  afterEach(() => {
    onEnd()
  })
}
