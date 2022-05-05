import { Post } from '../post/post.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  passwordHash!: string;

  @OneToMany(() => Post, (post) => post.author)
  posts!: Post[];
}
