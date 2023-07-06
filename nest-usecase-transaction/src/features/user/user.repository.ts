import { Injectable } from '@nestjs/common';
import { AppContext } from 'src/types/context';

@Injectable()
export class UserRepository {
  async find(ctx: AppContext, id: string) {
    return ctx.db.user.findUnique({ where: { id } });
  }

  async register(ctx: AppContext) {
    return ctx.db.user.create({});
  }

  async foo(ctx: AppContext) {
    return {};
  }
}
