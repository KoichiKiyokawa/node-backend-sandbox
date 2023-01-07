import type { PrismaClient } from "@prisma/client";
import { prisma } from "~/lib/db";

declare global {
  // eslint-disable-next-line
  var mockDB: PrismaClient;
}

class Rollback extends Error {}

/**
 * Rollback the database after each test case.
 * cf) https://github.com/Quramy/jest-prisma/blob/a5ac388db625b9f237ff6143ee5c63860012ceb3/packages/jest-prisma-core/src/delegate.ts#L102
 */
export const usePrismaTest = (fn: (mockDB: PrismaClient) => void | Promise<void>) =>
  prisma
    .$transaction(async (tx) => {
      await fn(tx as any);

      throw new Rollback();
    })
    .catch((err) => {
      if (err instanceof Rollback) return null;

      throw err;
    });
