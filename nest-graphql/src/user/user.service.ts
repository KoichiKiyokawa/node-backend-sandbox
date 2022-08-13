import { Injectable } from '@nestjs/common';
import { User } from './user.model';

@Injectable()
export class UserService {
  async findOne(id: string): Promise<User | null> {
    return new User();
  }
}
