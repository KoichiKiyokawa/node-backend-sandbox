import { Injectable } from '@nestjs/common';
import { db } from 'src/lib/db';
import { AppContext } from 'src/types/context';

@Injectable()
export class TransactionService {
  async transaction<T>(fn: (ctx: AppContext) => Promise<T>): Promise<T> {
    return db.$transaction(async (tx) => fn({ db: tx } as AppContext));
  }
}
