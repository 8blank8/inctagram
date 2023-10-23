import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@app/db';

@Injectable()
export class UserRepository {
  constructor(@Inject() private prisma: PrismaService) {}

  // TODO: types on save user
  async saveUser(user) {
    return this.prisma.user.upsert(user);
  }

  async deleteUser(userId: string) {
    return this.prisma.user.delete({ where: { id: userId } });
  }
}
