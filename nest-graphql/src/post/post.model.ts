import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Post {
  @Field()
  id!: string;

  @Field({ description: '投稿タイトル' })
  title!: string;

  @Field({ description: '投稿本文' })
  body!: string;
}
