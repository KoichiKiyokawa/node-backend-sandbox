import type { PrismaClient } from "@prisma/client";
import { prisma } from "~/lib/db";

declare global {
  // eslint-disable-next-line
  var mockDB: PrismaClient;
}

/**
 * Rollback the database after each test case.
 * cf) https://github.com/Quramy/jest-prisma/blob/a5ac388db625b9f237ff6143ee5c63860012ceb3/packages/jest-prisma-core/src/delegate.ts#L102
 */
export function usePrismaTest() {
  let onEnd: () => void;

  beforeEach(async () => {
    await new Promise<void>((resolve) =>
      // eslint-disable-next-line no-promise-executor-return
      prisma
        .$transaction(async (tx) => {
          global.mockDB = tx as PrismaClient;
          return new Promise((_, reject) => {
            onEnd = reject;
            resolve();
          });
        })
        .catch(() => null)
    );
  });

  afterEach(() => {
    onEnd();
  });
}
