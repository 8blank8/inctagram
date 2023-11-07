import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/db';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UserQueryRepository {
  constructor(private prisma: PrismaService) {}

  async byUserNameOrEmail(emailUserName: string): Promise<User | null> {
    const user = await this.prisma.user.findMany({
      where: {
        OR: [{ email: emailUserName }, { username: emailUserName }],
      },
    });
    return user[0];
  }
  async byUserName(userName: string): Promise<User | null> {
    const user = await this.prisma.user.findMany({
      where: { username: userName },
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

  async findAllUsers(params?: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params ?? {};

    const users = await this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
    const totalCount = await this.prisma.user.count();

    return {
      totalCount: +totalCount,
      items: users.map((u) => this._mapUserViewByMe(u)),
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _mapUserViewByMe({ password: _password, ...rest }: User) {
    return rest;
  }
}
