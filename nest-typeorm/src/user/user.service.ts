import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findUserWithPosts(userId: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id: userId },
      relations: { posts: true },
    });
  }
}
