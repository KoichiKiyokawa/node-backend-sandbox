import { PrismaClient } from '@prisma/client';

class BaseRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }
  get db() {
    return global.db || this.prisma;
  }
}

class UserRepository extends BaseRepository {
  constructor(prisma) {
    console.log("ok");
    super(prisma);
  }
  softDelete(id) {
    return this.db.user.update({
      data: { withdrawedAt: new Date() },
      where: { id }
    });
  }
  deletePosts(authorId) {
  }
}

const db = new PrismaClient();

const Transaction = () => {
  return (_target, _propertyKey, descriptor) => {
    const orig = descriptor.value;
    descriptor.value = () => {
      db.$transaction(async (tx) => {
        global.db = tx;
        await orig();
      }).then(() => {
        global.db = null;
      });
    };
  };
};

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp(target, key, result);
  return result;
};
class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }
  async withdraw(id) {
    console.log("this", this == null);
    await this.userRepository.softDelete(id);
    await this.userRepository.deletePosts(id);
  }
}
__decorateClass([
  Transaction()
], UserService.prototype, "withdraw", 1);

const userRepo = new UserRepository(db);
const userService = new UserService(userRepo);
userService.withdraw(1);
