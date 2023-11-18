import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/db';
import { GoogleUserData } from '@app/main/auth/use_cases/register-google-user.use-case';
import { GitUserData } from '@app/main/auth/use_cases/register-github-user.use-case';
import { ChangeProfileInfoDto } from '../dto/change.profile.info.dto';

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
    const profileData = { firstName: givenName, familyName };
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
          googleProvider: { create: providerData },
          userProfile: { create: profileData },
        },
        include: { userProfile: true, googleProvider: true },
      });
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
    const { firstname, lastname, aboutMe, dateOfBirth, username } = profileData;

    const newProfileData = {
      firstName: firstname,
      familyName: lastname,
      aboutMe: aboutMe,
      dateOfBirth: dateOfBirth,
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
