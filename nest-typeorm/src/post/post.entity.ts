import { User } from '../user/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column()
  title!: string;

  @Column()
  body!: string;

  @ManyToOne(() => User, (user) => user)
  author!: User;
}
