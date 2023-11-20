import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/db';
import { Prisma, User } from '@prisma/client';
import {
  userProfileSelect,
  UserProfileViewEntity,
} from '../entity/user-profile-view-entity';
import { userSelect } from '@app/main/user/entity/user-entity';

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

  async findUserProfileByUserId(
    userId: string,
  ): Promise<UserProfileViewEntity | null> {
    const user = await this.prisma.userProfile.findFirst({
      where: { userId: userId },
      select: userProfileSelect,
    });

    return this._mapUserProfileView(user);
  }

  async findMe(userId: string) {
    const user = await this.prisma.user.findFirstOrThrow({
      where: { id: userId },
      select: {
        userProfile: { select: userProfileSelect },
      },
    });

    if (!user) return null;

    return user;
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
      select: {
        ...userSelect,
        userProfile: { select: userProfileSelect },
      },
    });
    const totalCount = await this.prisma.user.count();

    return {
      totalCount: +totalCount,
      items: users,
    };
  }

  private _mapUserProfileView(userProfile): UserProfileViewEntity {
    return {
      userId: userProfile.userId,
      firstName: userProfile.firstName,
      familyName: userProfile.familyName,
      dateOfBirth: userProfile.dateOfBirth,
      aboutMe: userProfile.aboutMe,
      photos: userProfile.photos ?? [],
    };
  }
}
