import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findPostsByUserId(userId: string) {
    return this.prisma.user.findUnique({ where: { id: userId } }).posts();
  }
}
