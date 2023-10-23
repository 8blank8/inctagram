import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@app/db';
import { User } from '@prisma/client';

@Injectable()
export class UserQueryRepository {
  constructor(@Inject() private prisma: PrismaService) {}

  async findUserByLoginOrEmail(email: string): Promise<User | null> {
    const user = this.prisma.user.findFirstOrThrow({
      where: { email: email },
    });

    return user;
  }

  async findUserById(userId: string): Promise<User | null> {
    const user = await this.prisma.user.findFirstOrThrow({
      where: { id: userId },
    });
    if (!user) return null;
    return user;
  }

  async findMe(userId: string) {
    const user = await this.prisma.user.findFirstOrThrow({
      where: { id: userId },
    });

    if (!user) return null;

    return this._mapUserViewByMe(user);
  }

  async findAllUsers() {
    const users = this.prisma.user.findMany({});
    const totalCount = this.prisma.user.count();

    return {
      totalCount: +totalCount,
      items: users,
    };
  }

  private _mapUserViewByMe(user: User) {
    return {
      userId: user.id,
      username: user.username,
      email: user.email,
    };
  }
}
