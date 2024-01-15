import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/db';
import { GoogleUserData } from '@app/main/auth/use_cases/register-google-user.use-case';
import { GitUserData } from '@app/main/auth/use_cases/register-github-user.use-case';
import { ChangeProfileInfoDto } from '../dto/change.profile.info.dto';

interface SaveUserDTO {
  email: string;
  username: string;
  password: string;
  emailConfirmed?: boolean;
  userProfile?: { create: { firstName: string } };
}

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async saveUser({ userProfile, ...user }: SaveUserDTO) {
    return this.prisma.user.upsert({
      where: { email: user.email },
      update: user,
      create: { ...user, userProfile },
      include: { userProfile: !!userProfile },
    });
  }

  async saveGoogleUser({
    username,
    providerId,
    avatarUrl,
    givenName,
    familyName,
    email,
  }: GoogleUserData) {
    const providerData = { username, providerId };
    // TODO: fetch avatar url, and save to bucket
    console.log(avatarUrl);
    const photo = { size: '200', url: avatarUrl, title: username };
    const profileData = {
      firstName: givenName,
      familyName,
    };
    const found = await this.prisma.user.findFirst({
      where: { email },
    });
    if (found) {
      return this.prisma.user.update({
        where: { email },
        data: {
          emailConfirmed: true,
          googleProvider: {
            upsert: {
              where: { userId: found.id },
              create: providerData,
              update: providerData,
            },
          },
          userProfile: {
            upsert: {
              where: { userId: found.id },
              create: {
                ...profileData,
                photos: {
                  create: [{ ...photo, authorId: found.id }],
                },
              },
              update: profileData,
            },
          },
        },
        include: {
          userProfile: { include: { photos: true } },
          googleProvider: true,
        },
      });
    } else {
      const user = await this.prisma.user.create({
        data: {
          email,
          username,
          emailConfirmed: true,
          googleProvider: { create: providerData },
          userProfile: { create: profileData },
        },
        include: { userProfile: true, googleProvider: true },
      });
      await this.prisma.userProfile.update({
        where: { userId: user.id },
        data: {
          photos: { create: { ...photo, authorId: user.id } },
        },
        include: { photos: true },
      });
      return user;
    }
  }

  async saveGitHubUser({
    username,
    login,
    providerId,
    avatarUrl,
    displayName,
    email,
  }: GitUserData) {
    if (!email) throw new Error("Git hub didn't provide any e-mail");
    const [firstName, familyName] = displayName.split(' ');
    const providerData = { providerId: +providerId, email, gitName: login };
    // TODO: fetch avatar url, and save to bucket
    console.log(avatarUrl);
    const profileData = { firstName, familyName };
    const found = await this.prisma.user.findFirst({
      where: { email },
    });
    if (found) {
      return this.prisma.user.update({
        where: { email },
        data: {
          emailConfirmed: true,
          gitHubProvider: {
            upsert: {
              where: { userId: found.id },
              create: providerData,
              update: providerData,
            },
          },
          userProfile: {
            upsert: {
              where: { userId: found.id },
              create: profileData,
              update: profileData,
            },
          },
        },
        include: { userProfile: true, googleProvider: true },
      });
    } else {
      return this.prisma.user.create({
        data: {
          email,
          username,
          emailConfirmed: true,
          gitHubProvider: { create: providerData },
          userProfile: { create: profileData },
        },
        include: { userProfile: true, googleProvider: true },
      });
    }
  }

  async deleteUser(userId: string) {
    return this.prisma.user.delete({ where: { id: userId } });
  }

  async changeProfileInfo(userId: string, profileData: ChangeProfileInfoDto) {
    const { username, firstname, lastname, ...rest } = profileData;

    const newProfileData = {
      ...rest,
      firstName: firstname,
      familyName: lastname,
    };

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        username: username,
        userProfile: {
          upsert: {
            where: { userId: userId },
            update: newProfileData,
            create: newProfileData,
          },
        },
      },
      include: { userProfile: true },
    });
  }
}
