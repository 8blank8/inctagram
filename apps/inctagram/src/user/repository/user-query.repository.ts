import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/db';
import { Prisma, User, UserProfile } from '@prisma/client';
import { UserProfileViewEntity } from '../entity/user-profile-view-entity';

@Injectable()
export class UserQueryRepository {
  constructor(private prisma: PrismaService) {}

  async byUserNameOrEmail(
    emailUserName: string,
    include?: { userProfile: { include: { photos: boolean } } },
  ): Promise<User | null> {
    const user = await this.prisma.user.findMany({
      where: {
        OR: [{ email: emailUserName }, { username: emailUserName }],
      },
      include,
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

  async findUserProfileByUserId(userId: string): Promise<UserProfile | null> {
    const user = await this.prisma.userProfile.findFirst({
      where: { userId: userId },
      include: { photos: true },
    });

    return this._mapUserProfileView(user);
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
      include: { userProfile: { include: { photos: true } } },
    });
    const totalCount = await this.prisma.user.count();

    return {
      totalCount: +totalCount,
      items: users.map((u) => this._mapUserViewByMe(u)),
    };
  }

  private _mapUserProfileView(userProfile): UserProfileViewEntity {
    return {
      id: userProfile.id,
      userId: userProfile.userId,
      firstName: userProfile.firstName,
      familyName: userProfile.familyName,
      dateOfBirth: userProfile.dateOfBirth,
      aboutMe: userProfile.aboutMe,
      photos: userProfile.photos ?? [],
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _mapUserViewByMe({ password: _password, ...rest }: User) {
    return rest;
  }
}
