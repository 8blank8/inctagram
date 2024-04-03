import { PrismaClient } from '@prisma/client';

export const clearTestDB = async () => {
  const prisma = new PrismaClient();

  try {
    await prisma.user.deleteMany({});
    await prisma.device.deleteMany({});
    await prisma.userProfile.deleteMany({});
    await prisma.post.deleteMany({});
    await prisma.file.deleteMany({});
    await prisma.gitHubProvider.deleteMany({});
    await prisma.googleProvider.deleteMany({});
  } catch (e) {
    console.error('test database not clear', e);
  } finally {
    await prisma.$disconnect();
  }
};
