import { PrismaClient } from '@prisma/client';
import { testUsers } from './test.users.ustil';

export const clearTestDataBase = async (dropTables?: boolean) => {
  const tableNames = ['User', 'Post', 'Device'];

  const prisma = new PrismaClient();

  if (dropTables) {
    for (const tableName in tableNames) {
      await prisma.$queryRawUnsafe(
        `Truncate "${tableName}" restart identity cascade;`,
      );
    }
  }
  async function deleteUser(mail: string) {
    const user = await prisma.user.findFirst({ where: { email: mail } });
    if (user)
      await prisma.user.delete({
        where: { email: user.email },
      });
  }
  async function main() {
    for (const user of testUsers) await deleteUser(user.email);
  }

  await main().finally(async () => {
    await prisma.$disconnect();
  });
};
