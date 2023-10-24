import { PrismaClient } from '@prisma/client';


export const dropDataBase = async (app) => {
    const tableNames = ['User', 'Post', 'Device'];


    const prisma = new PrismaClient();
    async function main() {
        for (const tableName of tableNames) await prisma.$queryRawUnsafe(`Truncate "${tableName}" restart identity cascade;`);
    }

    main().finally(async () => {
        await prisma.$disconnect();
    });
}