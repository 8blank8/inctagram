import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/db';
import { User } from '@prisma/client';

@Injectable()
export class UserQueryRepository {
  constructor(private prisma: PrismaService) {}

  async findUserByLoginOrEmail(emailLogin: string): Promise<User | null> {
    const user = await this.prisma.user.findMany({
      where: {
        OR: [{ email: emailLogin }, { username: emailLogin }],
      },
    });
    return user[0];
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
