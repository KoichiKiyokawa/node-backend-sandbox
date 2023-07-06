import { PrismaClient } from '@prisma/client';

export type AppContext = {
  db: PrismaClient;
};
