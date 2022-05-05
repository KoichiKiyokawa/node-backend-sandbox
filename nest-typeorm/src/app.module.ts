import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';

@Module({
  imports: [DatabaseModule, UserModule, PostModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
