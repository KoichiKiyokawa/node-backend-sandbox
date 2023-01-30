import { db } from "~/lib/db"

async function seed() {
  await db.user.create({ data: { name: "foo", email: "foo@example.com" } })
}

seed()
  .then(async () => {
    await db.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await db.$disconnect()
    process.exit(1)
  })
