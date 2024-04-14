import { TestingModule } from "@nestjs/testing";
import { DataSource, QueryRunner } from "typeorm";

export class TestUtils {

    static async getDbServices(moduleRef: TestingModule) {
        const dataSource = await moduleRef.resolve(DataSource);
        const manager = dataSource.manager;
        const queryRunner = manager.connection.createQueryRunner();

        return {
            manager,
            queryRunner,
        }
    }

    static async dropDb(queryRunner: QueryRunner) {

        const tables = await queryRunner.query(`SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public' AND tablename != 'migrations'`);

        const truncateQueries = tables.map((table: { tablename: string }) => {
            return `TRUNCATE TABLE ${table.tablename} RESTART IDENTITY CASCADE;`;
        });

        await queryRunner.query(truncateQueries.join(''));
    }
}