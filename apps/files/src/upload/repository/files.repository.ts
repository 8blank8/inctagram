import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/db';
import { File } from '@prisma/client';

export type FolderType = 'avatar' | 'post';
@Injectable()
export class FilesRepository {
  constructor(private prisma: PrismaService) {}

  async getFile(fileId: string) {
    return this.prisma.file.findUniqueOrThrow({ where: { id: fileId } });
  }
  async deleteFile(fileId: string) {
    return this.prisma.file.delete({ where: { id: fileId } });
  }
  async deleteEntityFiles(entityId: string) {
    return this.prisma.file.deleteMany({
      where: {
        OR: [{ postId: entityId }, { userProfileId: entityId }],
      },
    });
  }

  async getEntityFiles(entityId: string): Promise<File[]> {
    return this.prisma.file.findMany({
      where: {
        OR: [{ postId: entityId }, { userProfileId: entityId }],
      },
    });
  }

  async saveProfileAvatar(file) {
    if (!file.authorId) {
      throw new Error('authorId or userProfileId required');
    }
    return this.prisma.userProfile.update({
      where: { userId: file.authorId },
      data: {
        photos: {
          upsert: {
            where: {
              url: file.url,
            },
            create: file,
            update: file,
          },
        },
      },
      include: { photos: true },
    });
  }
  async saveFileData(file, entity?: FolderType) {
    console.log(entity);
    if (entity === 'avatar') {
      return this.saveProfileAvatar(file);
    }
    if (entity === 'post' && file.postId) {
      return this.prisma.post.update({
        where: { id: file.postId },
        data: {
          photos: {
            upsert: {
              where: {
                url: file.url,
              },
              create: file,
              update: file,
            },
          },
        },
        include: { photos: true },
      });
    }
    if (!file.postId && !file.userProfileId && !file.authorId) {
      throw new Error('postId or userProfileId required');
    }
    return this.prisma.file.upsert({
      where: { url: file.url },
      update: file,
      create: file,
    });
  }
}
