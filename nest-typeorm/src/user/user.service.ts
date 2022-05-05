import { Inject, Injectable } from '@nestjs/common';
import { PROVIDER_NAMES } from 'src/constants';
import type { Repository } from 'typeorm';
import type { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject(PROVIDER_NAMES.USER_REPOSITORY)
    private userRepository: Repository<User>,
  ) {}

  async findUserWithPosts(userId: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id: userId },
      relations: { posts: true },
    });
  }
}
