import { YogaDriver, YogaDriverConfig } from '@graphql-yoga/nestjs';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { UserModule } from './features/user/user.module';
import { PostModule } from './features/post/post.module';

@Module({
  imports: [
    GraphQLModule.forRoot<YogaDriverConfig>({
      autoSchemaFile: 'schema.gql',
      driver: YogaDriver,
    }),
    UserModule,
    PostModule,
  ],
})
export class AppModule {}
