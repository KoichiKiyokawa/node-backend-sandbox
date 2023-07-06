import { Injectable } from '@nestjs/common';
import { TransactionService } from '../core/transaction.service';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly userRepository: UserRepository,
  ) {}

  async register() {
    await this.transactionService.transaction(async (ctx) => {
      await this.userRepository.register(ctx);
      await this.userRepository.foo(ctx);
      return { hge: 1 };
    });
  }
}
