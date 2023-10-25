import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/db';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  // TODO: types on save user
  async saveUser(user) {
    return this.prisma.user.upsert({
      where: { email: user.email },
      update: user,
      create: user,
    });
  }

  async deleteUser(userId: string) {
    return this.prisma.user.delete({ where: { id: userId } });
  }
}
