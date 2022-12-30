import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  findMany() {
    return this.prisma.post.findMany();
  }

  findAuthor(postId: string) {
    return this.prisma.post.findUnique({ where: { id: postId } }).author();
  }
}
