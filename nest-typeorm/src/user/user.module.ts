import { Module } from '@nestjs/common';
import { PROVIDER_NAMES } from 'src/constants';
import { DatabaseModule } from 'src/database/database.module';
import type { DataSource } from 'typeorm';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [
    {
      provide: PROVIDER_NAMES.USER_REPOSITORY,
      useFactory: (source: DataSource) => {
        return source.getRepository(User);
      },
      inject: [PROVIDER_NAMES.DATABASE_CONNECTION],
    },
    UserService,
  ],
})
export class UserModule {}
