import { PrismaClient } from '@prisma/client';
import { testUsers } from './test.users.ustil';

export const clearTestDataBase = async (dropTables?: boolean) => {
  const tableNames = ['User', 'Post', 'Device'];

  const prisma = new PrismaClient();

  async function deleteUser(mail: string) {
    const user = await prisma.user.findFirst({ where: { email: mail } });
    if (user) await prisma.user.delete({ where: { email: user.email } });
  }
  async function main() {
    if (dropTables) {
      for (const tableName in tableNames) {
        await prisma.$queryRawUnsafe(
          `Truncate "${tableName}" restart identity cascade;`,
        );
      }
    }

    for (const user of testUsers) {
      console.log('delete user => ', user.email);
      await deleteUser(user.email).catch(console.log);
    }
  }

  await main().finally(async () => {
    await prisma.$disconnect();
  });
};
