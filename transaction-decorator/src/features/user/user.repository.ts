import type { PrismaClient } from "@prisma/client"
import { BaseRepository } from "../core/base.repository"

export class UserRepository extends BaseRepository {
  constructor(prisma: PrismaClient) {
    console.log("ok")
    super(prisma)
  }

  softDelete(id: number) {
    return this.db.user.update({
      data: { withdrawedAt: new Date() },
      where: { id },
    })
  }

  deletePosts(authorId: number) {
    // this.db.posts.delete({ where: { authorId } })
    // throw Error("rollback!!!")
  }
}
