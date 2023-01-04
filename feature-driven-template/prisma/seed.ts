import { db } from "~/lib/db";

async function seed() {
  const users = await Promise.all([
    db.user.create({ data: { name: "user1", email: "user1@example.com" } }),
    db.user.create({ data: { name: "user2", email: "user2@example.com" } }),
    db.user.create({ data: { name: "user3", email: "user3@example.com" } }),
  ]);

  const room = await db.room.create({
    data: {
      name: "room1",
      users: {
        connect: users.map((user) => ({ id: user.id })),
      },
    },
  });

  await db.message.createMany({
    data: [
      { roomId: room.id, text: "message1", userId: users[0].id },
      { roomId: room.id, text: "message2", userId: users[1].id },
      { roomId: room.id, text: "message3", userId: users[2].id },
    ],
  });
}

seed();
