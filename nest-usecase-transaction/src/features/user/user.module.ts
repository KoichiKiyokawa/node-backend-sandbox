import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { TransactionService } from '../core/transaction.service';

@Module({
  providers: [UserResolver, UserService, TransactionService],
})
export class UserModule {}
