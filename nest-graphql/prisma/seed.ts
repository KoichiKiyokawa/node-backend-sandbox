import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  for (let i = 0; i < 10; i++) {
    const { id: userId } = await prisma.user.create({
      data: { name: `User${i}` },
    });

    for (let j = 0; j < 10; j++) {
      await prisma.post.create({
        data: { title: `Post${j}`, body: `Post body ${j}`, userId },
      });
    }
  }
}

seed();
